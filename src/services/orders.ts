import Decimal from "decimal.js";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { idempotencyKey } from "@/lib/ids";
import { Money } from "@/lib/money";
import type { CurrencyCode } from "@/types/enums";
import { getProviders } from "@/providers/registry";
import { tradingFee } from "@/domains/fees/engine";
import { assertOrderTransition } from "@/domains/ledger/invariants";
import {
  assertSufficientCash,
  customerCashCode,
  customerInvestmentsCode,
  customerSecuritiesClaimCode,
  feeRevenueCode,
  postLedger,
  safeguardedCashCode,
} from "@/domains/ledger/service";
import { recordAudit } from "@/services/audit";
import { notify } from "@/services/notifications";

export async function previewOrder(input: { assetId: string; amount: string }) {
  const asset = await prisma.asset.findUniqueOrThrow({ where: { id: input.assetId } });
  const principal = Money.from(input.amount, asset.currency as CurrencyCode);
  if (!principal.isPositive()) throw new AppError("INVALID_AMOUNT", "Enter an amount greater than zero.");
  const min = Money.from(asset.minimumInvestment, asset.currency as CurrencyCode);
  if (principal.lt(min)) {
    throw new AppError("BELOW_MINIMUM", `Minimum investment is ${min.toFixed()} ${asset.currency}.`);
  }
  const fees = tradingFee(principal);
  const quantity = new Decimal(principal.toFixed()).div(asset.price).toFixed(6);
  return { asset, principal, fees, quantity, price: asset.price };
}

export async function createOrder(input: {
  accountId: string;
  userId: string;
  assetId: string;
  amount: string;
  idempotencyKey?: string;
}) {
  const preview = await previewOrder({ assetId: input.assetId, amount: input.amount });
  await assertSufficientCash(input.accountId, preview.fees.grandTotal);
  const key = input.idempotencyKey ?? idempotencyKey("ord");
  const existing = await prisma.order.findUnique({ where: { idempotencyKey: key } });
  if (existing) return existing;

  const order = await prisma.order.create({
    data: {
      accountId: input.accountId,
      assetId: input.assetId,
      side: "buy",
      quantity: preview.quantity,
      orderType: "market",
      estimatedValue: preview.principal.toFixed(),
      fees: preview.fees.total.toFixed(),
      currency: preview.asset.currency,
      status: "submitted",
      idempotencyKey: key,
      submittedAt: new Date(),
    },
  });
  await recordAudit({ action: "ORDER_CREATED", entity: "order", entityId: order.id, actorId: input.userId });
  await notify({
    userId: input.userId,
    category: "order",
    title: "Order submitted",
    body: `Your order to invest in ${preview.asset.name} has been submitted.`,
  });
  return simulateFill(order.id, input.userId);
}

export async function simulateFill(orderId: string, userId?: string, opts?: { reject?: boolean }) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: { asset: true } });
  if (opts?.reject) {
    assertOrderTransition(order.status, "rejected");
    await prisma.order.update({ where: { id: order.id }, data: { status: "rejected" } });
    if (userId) {
      await notify({
        userId,
        category: "order",
        title: "Order rejected",
        body: "The sandbox broker rejected this order. Your cash was not invested.",
      });
    }
    return prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  }

  assertOrderTransition(order.status, "accepted");
  await prisma.order.update({ where: { id: order.id }, data: { status: "accepted" } });

  const broker = getProviders().broker;
  const result = await broker.placeOrder({
    accountRef: order.accountId,
    symbol: order.asset.symbol,
    side: "buy",
    quantity: order.quantity,
    orderType: "market",
    idempotencyKey: order.idempotencyKey,
    limitPrice: order.asset.price,
  });

  if (result.status === "rejected") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "rejected", providerRef: result.providerRef } });
    return prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "filled", filledQuantity: result.filledQuantity, providerRef: result.providerRef },
  });
  await prisma.execution.create({
    data: {
      orderId: order.id,
      quantity: result.filledQuantity,
      price: order.asset.price,
      currency: order.currency,
    },
  });
  await recordAudit({ action: "ORDER_FILLED", entity: "order", entityId: order.id, actorId: userId });
  return settleOrder(order.id, userId);
}

export async function settleOrder(orderId: string, userId?: string) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: { asset: true, account: true } });
  assertOrderTransition("filled", "settlement_pending");
  await prisma.order.update({ where: { id: order.id }, data: { status: "settlement_pending" } });

  const currency = order.currency as CurrencyCode;
  const principal = Money.from(order.estimatedValue, currency);
  const fee = Money.from(order.fees, currency);
  const cash = await customerCashCode(order.accountId, currency);
  const inv = await customerInvestmentsCode(order.accountId, currency);
  const claim = await customerSecuritiesClaimCode(order.accountId, currency);
  const bank = await safeguardedCashCode(currency);
  const feeAcc = await feeRevenueCode(currency, "trading");

  const ledger = await postLedger({
    type: "investment",
    description: `Buy ${order.asset.symbol}`,
    idempotencyKey: `settle:${order.idempotencyKey}`,
    lines: [
      { accountCode: cash, direction: "debit", amount: principal.toFixed(), currency },
      { accountCode: bank, direction: "credit", amount: principal.toFixed(), currency },
      { accountCode: inv, direction: "debit", amount: principal.toFixed(), currency },
      { accountCode: claim, direction: "credit", amount: principal.toFixed(), currency },
      { accountCode: cash, direction: "debit", amount: fee.toFixed(), currency },
      { accountCode: feeAcc, direction: "credit", amount: fee.toFixed(), currency },
    ],
  });

  const existing = await prisma.position.findUnique({
    where: { accountId_assetId: { accountId: order.accountId, assetId: order.assetId } },
  });
  const qty = new Decimal(order.filledQuantity);
  if (!existing) {
    await prisma.position.create({
      data: {
        accountId: order.accountId,
        assetId: order.assetId,
        quantity: qty.toFixed(6),
        averageCost: order.asset.price,
        costBasis: principal.toFixed(),
        currency,
      },
    });
  } else {
    const newQty = new Decimal(existing.quantity).plus(qty);
    const newCost = new Decimal(existing.costBasis).plus(principal.toFixed());
    const avg = newCost.div(newQty);
    await prisma.position.update({
      where: { id: existing.id },
      data: {
        quantity: newQty.toFixed(6),
        costBasis: newCost.toFixed(2),
        averageCost: avg.toFixed(6),
      },
    });
  }

  await prisma.settlement.create({
    data: { orderId: order.id, status: "settled", settledAt: new Date() },
  });
  await prisma.order.update({ where: { id: order.id }, data: { status: "settled" } });
  await prisma.transaction.create({
    data: {
      accountId: order.accountId,
      type: "investment",
      status: "completed",
      amount: principal.toFixed(),
      currency,
      description: `Invested in ${order.asset.name}`,
      relatedId: order.id,
      ledgerTxnId: ledger.id,
    },
  });
  await prisma.revenueEvent.create({
    data: { stream: "trading", amount: fee.toFixed(), currency, sourceId: order.id },
  });
  await prisma.transaction.create({
    data: {
      accountId: order.accountId,
      type: "fee",
      status: "completed",
      amount: fee.toFixed(),
      currency,
      description: "Trading fee",
      relatedId: order.id,
    },
  });

  if (userId ?? order.account.userId) {
    await notify({
      userId: userId ?? order.account.userId,
      category: "order",
      title: "Order settled",
      body: `${order.asset.name} is now in your portfolio.`,
    });
  }
  return prisma.order.findUniqueOrThrow({ where: { id: order.id, }, include: { asset: true, executions: true } });
}
