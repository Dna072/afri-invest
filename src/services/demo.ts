import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { Money } from "@/lib/money";
import type { CurrencyCode } from "@/types/enums";
import { completeDeposit, createDeposit, failDeposit } from "@/services/funding";
import { createFxQuote, executeFxQuote } from "@/services/fx";
import { createOrder, simulateFill } from "@/services/orders";
import { notify } from "@/services/notifications";
import { recordAudit } from "@/services/audit";
import { customerCashCode, postLedger, safeguardedCashCode } from "@/domains/ledger/service";
import { getProviders } from "@/providers/registry";

export async function generateDeposit(accountId: string, userId: string, amount: string, currency: CurrencyCode) {
  return createDeposit({ accountId, userId, amount, currency, method: "demo" });
}

export async function generatePaymentFailure(accountId: string, userId: string) {
  return createDeposit({ accountId, userId, amount: "0", currency: "GHS", method: "fail" });
}

export async function generateFx(accountId: string, userId: string, amount: string, from: CurrencyCode, to: CurrencyCode) {
  const { row } = await createFxQuote({ accountId, from, to, amount });
  return executeFxQuote({ quoteId: row.id, userId });
}

export async function generateOrder(accountId: string, userId: string, assetId: string, amount: string) {
  return createOrder({ accountId, userId, assetId, amount });
}

export async function rejectLatestOrder(orderId: string, userId: string) {
  return simulateFill(orderId, userId, { reject: true });
}

export async function generateDividend(accountId: string, userId: string, assetId: string) {
  const asset = await prisma.asset.findUniqueOrThrow({ where: { id: assetId } });
  const currency = asset.currency as CurrencyCode;
  const gross = Money.from("120.00", currency);
  const withholding = Money.from("9.60", currency);
  const net = gross.sub(withholding);
  const dividend = await prisma.dividend.create({
    data: {
      accountId,
      assetId,
      grossAmount: gross.toFixed(),
      withholding: withholding.toFixed(),
      netAmount: net.toFixed(),
      currency,
      status: "received",
      payableDate: new Date(),
    },
  });
  const cash = await customerCashCode(accountId, currency);
  const bank = await safeguardedCashCode(currency);
  await postLedger({
    type: "dividend",
    description: `Dividend ${asset.symbol}`,
    idempotencyKey: `div:${dividend.id}`,
    lines: [
      { accountCode: bank, direction: "debit", amount: net.toFixed(), currency },
      { accountCode: cash, direction: "credit", amount: net.toFixed(), currency },
    ],
  });
  await prisma.transaction.create({
    data: {
      accountId,
      type: "dividend",
      status: "completed",
      amount: net.toFixed(),
      currency,
      description: `Dividend from ${asset.name}`,
      relatedId: dividend.id,
    },
  });
  await notify({
    userId,
    category: "dividend",
    title: "Dividend received",
    body: `${asset.name} paid ${currency} ${net.toFixed()}.`,
  });
  return dividend;
}

export async function generateKycReview(userId: string) {
  const kyc = await prisma.kycProfile.findUnique({ where: { userId } });
  if (!kyc) throw new AppError("KYC_MISSING", "No KYC profile.");
  await prisma.kycProfile.update({ where: { id: kyc.id }, data: { status: "review" } });
  const session = await prisma.verificationSession.create({
    data: { kycId: kyc.id, provider: "mock", status: "review" },
  });
  await prisma.verificationCheck.create({
    data: { sessionId: session.id, category: "pep", result: "REVIEW", notes: "Demo PEP review" },
  });
  await recordAudit({ action: "KYC_SUBMITTED", entity: "kyc", entityId: kyc.id, actorId: userId });
  return kyc;
}

export async function generateAmlAlert(userId: string) {
  const alert = await prisma.amlAlert.create({
    data: {
      userId,
      severity: "high",
      status: "open",
      title: "High transaction velocity",
      details: "Demo rule: multiple funding events in a short window.",
    },
  });
  await prisma.amlCase.create({
    data: { alertId: alert.id, status: "open", riskLevel: "high" },
  });
  await recordAudit({ action: "AML_ALERT_CREATED", entity: "aml_alert", entityId: alert.id });
  return alert;
}

export async function generateReconciliationException() {
  const item = await prisma.reconciliationItem.create({
    data: {
      sourceA: "Internal Ledger",
      sourceB: "Custodian",
      amountA: "18420120.00",
      amountB: "18420118.00",
      currency: "GHS",
      difference: "2.00",
      status: "mismatch",
      notes: "Demo mismatch for operations training.",
    },
  });
  await recordAudit({ action: "RECONCILIATION_EXCEPTION_CREATED", entity: "reconciliation", entityId: item.id });
  return item;
}

export async function advanceRegulatoryStage(stageId: string, actorId: string, override = false) {
  const stage = await prisma.regulatoryStage.findUniqueOrThrow({
    where: { id: stageId },
    include: { requirements: true },
  });
  const outstanding = stage.requirements.filter((r) => r.mandatory && r.status !== "passed" && r.status !== "waived");
  if (outstanding.length && !override) {
    throw new AppError("STAGE_GATES_INCOMPLETE", "Mandatory gates remain incomplete.");
  }
  await prisma.regulatoryStage.update({
    where: { id: stageId },
    data: { status: "passed", completedAt: new Date(), notes: override ? "Administrative override." : stage.notes },
  });
  await recordAudit({
    action: "REGULATORY_STAGE_UPDATED",
    entity: "regulatory_stage",
    entityId: stageId,
    actorId,
    metadata: { override },
  });
}

void failDeposit;
void getProviders;
void completeDeposit;
