import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import Decimal from "decimal.js";
import { ARTICLES, ASSET_SEED, CURRENCY_SEED, MARKET_SEED } from "../src/mock/catalog";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "AfricaInvest!demo";

async function main() {
  console.log("Seeding Africa Invest sandbox…");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.$transaction(CURRENCY_SEED.map((c) => prisma.currency.upsert({ where: { code: c.code }, update: c, create: c })));

  for (const market of MARKET_SEED) {
    await prisma.market.upsert({
      where: { id: market.id },
      update: {
        name: market.name,
        country: market.country,
        countryCode: market.countryCode,
        currency: market.currency,
        status: market.status,
        description: market.description,
        timezone: market.timezone,
        featureFlag: market.featureFlag,
      },
      create: {
        id: market.id,
        name: market.name,
        country: market.country,
        countryCode: market.countryCode,
        currency: market.currency,
        status: market.status,
        description: market.description,
        timezone: market.timezone,
        featureFlag: market.featureFlag,
      },
    });
    for (const ex of market.exchanges) {
      await prisma.exchange.upsert({
        where: { id: ex.id },
        update: ex,
        create: { ...ex, marketId: market.id },
      });
    }
    await prisma.tradingCalendar.create({
      data: {
        marketId: market.id,
        timezone: market.timezone,
        openTime: "10:00",
        closeTime: "15:00",
        tradingDays: "1,2,3,4,5",
        holidaysJson: "[]",
      },
    });
  }

  const assetIds: Record<string, string> = {};
  for (const asset of ASSET_SEED) {
    const created = await prisma.asset.create({
      data: {
        ...asset,
        status: "sandbox",
        dataSource: "sandbox",
      },
    });
    assetIds[asset.symbol] = created.id;
    if (asset.assetType === "treasury" || asset.assetType === "bond") {
      await prisma.bondTerms.create({
        data: {
          assetId: created.id,
          yieldPercent: asset.assetType === "treasury" ? "24.50" : "18.20",
          maturityDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (asset.symbol.includes("91") ? 91 : 365)),
          coupon: asset.assetType === "bond" ? "18.20" : null,
          instrumentKind: asset.assetType,
        },
      });
    }
    const price = new Decimal(asset.price);
    const history = [];
    for (let i = 40; i >= 0; i -= 1) {
      const close = price.times(new Decimal(1).minus(i * 0.0025).plus(Math.sin(i) * 0.01));
      history.push({
        assetId: created.id,
        ts: new Date(Date.now() - i * 86_400_000),
        open: close.times(0.995).toFixed(4),
        high: close.times(1.01).toFixed(4),
        low: close.times(0.99).toFixed(4),
        close: close.toFixed(4),
        volume: String(10_000 + i * 130),
      });
    }
    await prisma.priceHistory.createMany({ data: history });
  }

  await prisma.ipoOffer.create({
    data: {
      assetId: assetIds["SOLAR-IPO"],
      offerPrice: "1.20",
      subscriptionOpen: new Date(),
      subscriptionClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      minimumInvestment: "200",
      status: "open",
      riskInformation: "This is a fictional IPO for product demonstration. It is not a real securities offering.",
    },
  });

  const flags = [
    ["ghana_equities", "enabled", "Ghana listed equities in sandbox"],
    ["ghana_treasuries", "enabled", "Ghana treasury bills in sandbox"],
    ["funds", "enabled", "Sandbox funds"],
    ["ipo", "beta", "Fictional IPO flow"],
    ["diaspora_funding", "enabled", "Diaspora funding corridors"],
    ["fx", "enabled", "Sandbox FX engine"],
    ["auto_invest", "enabled", "Recurring investments"],
    ["premium", "beta", "Premium subscription architecture"],
    ["nigeria_market", "disabled", "Nigeria — coming soon"],
    ["kenya_market", "disabled", "Kenya — coming soon"],
    ["south_africa_market", "disabled", "South Africa — coming soon"],
    ["brvm_market", "disabled", "BRVM — coming soon"],
    ["global_markets", "disabled", "Global markets — coming soon"],
    ["fractional_investing", "disabled", "Fractional shares not enabled"],
  ] as const;
  for (const [key, status, description] of flags) {
    await prisma.featureFlag.create({ data: { key, status, description } });
  }

  const schedule = await prisma.feeSchedule.create({ data: { name: "Ghana sandbox", marketId: "ghana", active: true } });
  await prisma.feeRule.createMany({
    data: [
      { scheduleId: schedule.id, code: "trading", name: "Trading fee", type: "bps", bps: "50", appliesTo: "order" },
      { scheduleId: schedule.id, code: "fx", name: "FX fee", type: "bps", bps: "60", appliesTo: "fx" },
      { scheduleId: schedule.id, code: "withdrawal", name: "Withdrawal fee", type: "flat", flatAmount: "0", currency: "GHS", appliesTo: "withdrawal" },
    ],
  });

  await prisma.monitoringRule.createMany({
    data: [
      { code: "velocity", name: "Transaction velocity", type: "velocity", description: "Many transactions in a short window" },
      { code: "large_amount", name: "Large transaction", type: "threshold", description: "Amount above configured limit" },
      { code: "unusual_country", name: "Unusual country", type: "geography", description: "Activity from unexpected jurisdiction" },
      { code: "rapid_roundtrip", name: "Rapid deposit/withdrawal", type: "pattern", description: "Funds in and out quickly" },
      { code: "structuring", name: "Structuring", type: "pattern", description: "Just-below-threshold repeats" },
    ],
  });

  const firstNames = ["Amina", "Kwame", "Yaw", "Efua", "Ngozi", "Tunde", "Wanjiku", "Otieno", "Thabo", "Lerato", "Fatou", "Ibrahim", "Akosua", "Kojo", "Zainab", "Ade", "Aisha", "Kofi", "Mawuli", "Sena", "Nana", "Adwoa", "Yawson", "Mensah", "Boateng", "Osei", "Owusu", "Asante", "Darko", "Appiah", "Baah", "Sarpong", "Frimpong", "Gyamfi", "Opoku", "Annan", "Lamptey", "Quaye", "Tetteh", "Amoako", "Baffour", "Adjei", "Nyarko", "Poku"];
  const users: { id: string; accountId: string; persona?: string }[] = [];

  async function createUser(input: {
    email: string;
    firstName: string;
    lastName: string;
    nationality: string;
    countryOfResidence: string;
    primaryCurrency: string;
    role?: string;
    personaKey?: string;
    city?: string;
  }) {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        displayName: input.firstName,
        nationality: input.nationality,
        countryOfResidence: input.countryOfResidence,
        primaryCurrency: input.primaryCurrency,
        role: input.role ?? "customer",
        isDemoPersona: Boolean(input.personaKey),
        personaKey: input.personaKey,
        profile: { create: { city: input.city ?? "Accra", occupation: "Professional" } },
        investorProfile: {
          create: {
            experience: "some",
            horizon: "long",
            objective: "grow",
            riskTolerance: "medium",
            liquidityNeeds: "low",
            resultBand: "Growth",
            isEducationalOnly: true,
            completedAt: new Date(),
          },
        },
        taxProfile: { create: { taxResidence: input.countryOfResidence, usPerson: false } },
        securityProfile: { create: { mfaEnabled: false } },
        kycProfile: { create: { status: "pass", riskRating: "low" } },
        privacyPreference: { create: {} },
      },
    });
    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: "investment",
        status: "active",
        baseCurrency: input.primaryCurrency,
        label: "Investment account",
        safeguardingClass: "customer_assets",
      },
    });
    await prisma.watchlist.create({ data: { userId: user.id, name: "Default" } });
    await prisma.subscription.create({ data: { userId: user.id, plan: "free", status: "active" } });
    users.push({ id: user.id, accountId: account.id, persona: input.personaKey });
    return { user, account };
  }

  const derrick = await createUser({
    email: "derrick@africainvest.demo",
    firstName: "Derrick",
    lastName: "Mensah",
    nationality: "Ghana",
    countryOfResidence: "Sweden",
    primaryCurrency: "SEK",
    personaKey: "derrick",
    city: "Stockholm",
  });
  const ama = await createUser({
    email: "ama@africainvest.demo",
    firstName: "Ama",
    lastName: "Owusu",
    nationality: "Ghana",
    countryOfResidence: "Ghana",
    primaryCurrency: "GHS",
    personaKey: "ama",
    city: "Accra",
  });
  const kofi = await createUser({
    email: "kofi@africainvest.demo",
    firstName: "Kofi",
    lastName: "Boateng",
    nationality: "Ghana",
    countryOfResidence: "United Kingdom",
    primaryCurrency: "GBP",
    personaKey: "kofi",
    city: "London",
  });
  const chinedu = await createUser({
    email: "chinedu@africainvest.demo",
    firstName: "Chinedu",
    lastName: "Okafor",
    nationality: "Nigeria",
    countryOfResidence: "Nigeria",
    primaryCurrency: "NGN",
    personaKey: "chinedu",
    city: "Lagos",
  });
  await createUser({
    email: "ops@africainvest.demo",
    firstName: "Abena",
    lastName: "Admin",
    nationality: "Ghana",
    countryOfResidence: "Ghana",
    primaryCurrency: "GHS",
    role: "admin",
    personaKey: "admin",
    city: "Accra",
  });

  for (let i = 0; i < 45; i += 1) {
    const first = firstNames[i % firstNames.length];
    await createUser({
      email: `investor${i + 1}@sandbox.africainvest.demo`,
      firstName: first,
      lastName: `Demo${i + 1}`,
      nationality: i % 2 === 0 ? "Ghana" : "Nigeria",
      countryOfResidence: ["Sweden", "Ghana", "United Kingdom", "Germany", "Canada"][i % 5],
      primaryCurrency: ["SEK", "GHS", "GBP", "EUR", "USD"][i % 5],
    });
  }

  await seedDerrick(derrick.user.id, derrick.account.id, assetIds);
  await seedSimplePortfolio(ama.account.id, ama.user.id, assetIds, "GHS", "42000.00");
  await seedSimplePortfolio(kofi.account.id, kofi.user.id, assetIds, "GBP", "8500.00");
  await seedSimplePortfolio(chinedu.account.id, chinedu.user.id, assetIds, "NGN", "2500000.00");

  for (const article of ARTICLES) {
    await prisma.educationArticle.create({ data: article });
  }

  await seedOps(assetIds, users);
  console.log("Seed complete. Demo password for all personas: AfricaInvest!demo");
}

async function ledgerAccount(
  code: string,
  data: {
    name: string;
    type: string;
    currency: string;
    ownerType: string;
    ownerId?: string;
    classification: string;
    accountId?: string;
  },
) {
  return prisma.ledgerAccount.upsert({ where: { code }, update: {}, create: { ...data, code } });
}

async function postOpening(
  type: string,
  description: string,
  key: string,
  lines: Array<{ code: string; dir: "debit" | "credit"; amount: string; ccy: string }>,
) {
  const txn = await prisma.ledgerTransaction.create({
    data: { type, description, idempotencyKey: key, status: "completed" },
  });
  for (const line of lines) {
    const acc = await prisma.ledgerAccount.findUniqueOrThrow({ where: { code: line.code } });
    await prisma.ledgerEntry.create({
      data: {
        transactionId: txn.id,
        ledgerAccountId: acc.id,
        direction: line.dir,
        amount: line.amount,
        currency: line.ccy,
      },
    });
  }
  return txn;
}

async function refreshCash(accountId: string, currency: string, code: string) {
  const acc = await prisma.ledgerAccount.findUniqueOrThrow({ where: { code } });
  const entries = await prisma.ledgerEntry.findMany({ where: { ledgerAccountId: acc.id } });
  let debit = new Decimal(0);
  let credit = new Decimal(0);
  for (const e of entries) {
    if (e.direction === "debit") debit = debit.plus(e.amount);
    else credit = credit.plus(e.amount);
  }
  const available = credit.minus(debit).toFixed(2);
  await prisma.currencyBalance.upsert({
    where: { accountId_currency: { accountId, currency } },
    update: { available },
    create: { accountId, currency, available, pending: "0", reserved: "0" },
  });
}

async function seedDerrick(userId: string, accountId: string, assetIds: Record<string, string>) {
  const cashSEK = `CUST_CASH:${accountId}:SEK`;
  const cashGHS = `CUST_CASH:${accountId}:GHS`;
  const invGHS = `CUST_INV:${accountId}:GHS`;
  const secGHS = `CUST_SEC:${accountId}:GHS`;
  await ledgerAccount(cashSEK, { name: "Customer cash SEK", type: "liability", currency: "SEK", ownerType: "customer", ownerId: accountId, classification: "customer_cash", accountId });
  await ledgerAccount(cashGHS, { name: "Customer cash GHS", type: "liability", currency: "GHS", ownerType: "customer", ownerId: accountId, classification: "customer_cash", accountId });
  await ledgerAccount(invGHS, { name: "Investments GHS", type: "asset", currency: "GHS", ownerType: "customer", ownerId: accountId, classification: "customer_securities", accountId });
  await ledgerAccount(secGHS, { name: "Securities claim GHS", type: "liability", currency: "GHS", ownerType: "customer", ownerId: accountId, classification: "customer_securities", accountId });
  await ledgerAccount("SAFE_BANK:SEK", { name: "Safeguarded SEK", type: "asset", currency: "SEK", ownerType: "platform", classification: "customer_safeguarded_cash" });
  await ledgerAccount("SAFE_BANK:GHS", { name: "Safeguarded GHS", type: "asset", currency: "GHS", ownerType: "platform", classification: "customer_safeguarded_cash" });
  await ledgerAccount("REV_FX:SEK", { name: "FX revenue SEK", type: "income", currency: "SEK", ownerType: "platform", classification: "platform_operating" });
  await ledgerAccount("REV_TRADING:GHS", { name: "Trading revenue GHS", type: "income", currency: "GHS", ownerType: "platform", classification: "platform_operating" });

  await postOpening("deposit", "Opening SEK deposit", "open:derrick:sek", [
    { code: "SAFE_BANK:SEK", dir: "debit", amount: "100000.00", ccy: "SEK" },
    { code: cashSEK, dir: "credit", amount: "100000.00", ccy: "SEK" },
  ]);
  await postOpening("fx_conversion", "SEK to GHS (historical)", "open:derrick:fx", [
    { code: cashSEK, dir: "debit", amount: "84580.00", ccy: "SEK" },
    { code: "SAFE_BANK:SEK", dir: "credit", amount: "84072.52", ccy: "SEK" },
    { code: "REV_FX:SEK", dir: "credit", amount: "507.48", ccy: "SEK" },
    { code: "SAFE_BANK:GHS", dir: "debit", amount: "80060.32", ccy: "GHS" },
    { code: cashGHS, dir: "credit", amount: "80060.32", ccy: "GHS" },
  ]);

  const holdings = [
    { symbol: "MTNGH", qty: "2500", cost: "7900.00", price: "3.42" },
    { symbol: "GCB", qty: "1800", cost: "10200.00", price: "6.15" },
    { symbol: "FML", qty: "1200", cost: "5310.00", price: "4.80" },
    { symbol: "CAL", qty: "2000", cost: "1660.00", price: "0.90" },
    { symbol: "TOTAL", qty: "400", cost: "4580.00", price: "12.40" },
    { symbol: "EGH", qty: "680", cost: "3450.00", price: "5.50" },
    { symbol: "GHS91D", qty: "250", cost: "25000.00", price: "100.00" },
    { symbol: "AFRI-EQ", qty: "1800", cost: "16600.00", price: "10.00" },
  ];
  let invested = new Decimal(0);
  for (const h of holdings) {
    invested = invested.plus(h.cost);
    await prisma.position.create({
      data: {
        accountId,
        assetId: assetIds[h.symbol],
        quantity: h.qty,
        averageCost: new Decimal(h.cost).div(h.qty).toFixed(6),
        costBasis: h.cost,
        currency: "GHS",
      },
    });
  }
  await postOpening("investment", "Opening Ghana portfolio", "open:derrick:inv", [
    { code: cashGHS, dir: "debit", amount: invested.toFixed(2), ccy: "GHS" },
    { code: "SAFE_BANK:GHS", dir: "credit", amount: invested.toFixed(2), ccy: "GHS" },
    { code: invGHS, dir: "debit", amount: invested.toFixed(2), ccy: "GHS" },
    { code: secGHS, dir: "credit", amount: invested.toFixed(2), ccy: "GHS" },
  ]);

  await refreshCash(accountId, "SEK", cashSEK);
  await refreshCash(accountId, "GHS", cashGHS);

  const watchlist = await prisma.watchlist.findFirstOrThrow({ where: { userId } });
  for (const [i, symbol] of ["UNIL", "SCB", "GOIL", "SAFCOM"].entries()) {
    await prisma.watchlistItem.create({ data: { watchlistId: watchlist.id, assetId: assetIds[symbol], sortOrder: i } });
  }

  await prisma.autoInvestPlan.create({
    data: {
      accountId,
      name: "Monthly Ghana mix",
      fundingSource: "SEK balance",
      fundingCurrency: "SEK",
      schedule: "monthly",
      amount: "2000.00",
      maxAmount: "2000.00",
      allocationJson: JSON.stringify([
        { label: "Ghana equities", percent: 40 },
        { label: "Treasury", percent: 30 },
        { label: "African fund", percent: 20 },
        { label: "Cash", percent: 10 },
      ]),
      status: "active",
      nextExecution: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
    },
  });

  await prisma.investmentGoal.create({
    data: {
      userId,
      accountId,
      type: "wealth",
      name: "Long-term Ghana wealth",
      targetAmount: "250000.00",
      currentAmount: "84240.32",
      currency: "GHS",
      targetDate: new Date("2032-12-31"),
      monthlyContribution: "2000.00",
    },
  });

  await prisma.dividend.create({
    data: {
      accountId,
      assetId: assetIds.MTNGH,
      grossAmount: "180.00",
      withholding: "14.40",
      netAmount: "165.60",
      currency: "GHS",
      status: "received",
      payableDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    },
  });

  const order = await prisma.order.create({
    data: {
      accountId,
      assetId: assetIds.MTNGH,
      side: "buy",
      quantity: "200",
      filledQuantity: "200",
      orderType: "market",
      estimatedValue: "684.00",
      fees: "3.42",
      currency: "GHS",
      status: "settled",
      idempotencyKey: "seed:derrick:mtn",
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  });
  await prisma.execution.create({
    data: { orderId: order.id, quantity: "200", price: "3.42", currency: "GHS" },
  });
  await prisma.settlement.create({ data: { orderId: order.id, status: "settled", settledAt: new Date() } });

  await prisma.fxQuote.create({
    data: {
      accountId,
      baseCurrency: "SEK",
      quoteCurrency: "GHS",
      sourceRate: "1.164000",
      platformFee: "30.00",
      spread: "15.00",
      customerAmount: "5000.00",
      amountReceived: "5750.00",
      feeCurrency: "SEK",
      expiresAt: new Date(Date.now() - 1000 * 60 * 60),
      status: "executed",
    },
  });

  await prisma.transaction.createMany({
    data: [
      { accountId, type: "deposit", status: "completed", amount: "100000.00", currency: "SEK", description: "International transfer from SEB" },
      { accountId, type: "fx", status: "completed", amount: "5000.00", currency: "SEK", counterAmount: "5750.00", counterCurrency: "GHS", description: "SEK → GHS" },
      { accountId, type: "investment", status: "completed", amount: "684.00", currency: "GHS", description: "Invested in MTN Ghana" },
      { accountId, type: "dividend", status: "completed", amount: "165.60", currency: "GHS", description: "Dividend from MTN Ghana" },
      { accountId, type: "fee", status: "completed", amount: "3.42", currency: "GHS", description: "Trading fee" },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId, category: "order", title: "Order settled", body: "MTN Ghana is now in your portfolio." },
      { userId, category: "dividend", title: "Dividend received", body: "MTN Ghana paid GHS 165.60." },
      { userId, category: "funding", title: "Currency converted", body: "You converted SEK 5,000 to GHS." },
      { userId, category: "portfolio", title: "Monthly summary", body: "Your Ghana portfolio moved +1.2% this week. Educational only." },
    ],
  });

  await prisma.document.createMany({
    data: [
      { userId, accountId, type: "statement", title: "August account statement", status: "available" },
      { userId, accountId, type: "trade_confirmation", title: "MTN Ghana trade confirmation", status: "available" },
      { userId, accountId, type: "dividend", title: "MTN dividend voucher", status: "available" },
    ],
  });

  await prisma.priceAlert.create({
    data: { userId, assetId: assetIds.UNIL, operator: "gte", price: "18.50", currency: "GHS" },
  });
}

async function seedSimplePortfolio(accountId: string, userId: string, assetIds: Record<string, string>, ccy: string, amount: string) {
  const cash = `CUST_CASH:${accountId}:${ccy}`;
  await ledgerAccount(cash, { name: `Customer cash ${ccy}`, type: "liability", currency: ccy, ownerType: "customer", ownerId: accountId, classification: "customer_cash", accountId });
  await ledgerAccount(`SAFE_BANK:${ccy}`, { name: `Safeguarded ${ccy}`, type: "asset", currency: ccy, ownerType: "platform", classification: "customer_safeguarded_cash" });
  await postOpening("deposit", `Opening ${ccy}`, `open:${accountId}:${ccy}`, [
    { code: `SAFE_BANK:${ccy}`, dir: "debit", amount, ccy },
    { code: cash, dir: "credit", amount, ccy },
  ]);
  await refreshCash(accountId, ccy, cash);
  if (ccy === "GHS") {
    await prisma.position.create({
      data: {
        accountId,
        assetId: assetIds.MTNGH,
        quantity: "800",
        averageCost: "3.10",
        costBasis: "2480.00",
        currency: "GHS",
      },
    });
  }
  await prisma.notification.create({
    data: { userId, category: "system", title: "Welcome", body: "This is a sandbox account with fictional data." },
  });
}

async function seedOps(assetIds: Record<string, string>, users: { id: string; accountId: string }[]) {
  for (let i = 0; i < 30; i += 1) {
    const u = users[i % users.length];
    await prisma.kycReview.create({
      data: {
        kycId: (await prisma.kycProfile.findUniqueOrThrow({ where: { userId: u.id } })).id,
        decision: i % 5 === 0 ? "review" : "pass",
        notes: "Sandbox KYC review",
      },
    });
  }

  for (let i = 0; i < 15; i += 1) {
    const alert = await prisma.amlAlert.create({
      data: {
        userId: users[i].id,
        severity: i % 3 === 0 ? "high" : "medium",
        status: i % 4 === 0 ? "investigating" : "open",
        title: ["High transaction velocity", "Large amount", "Multiple countries", "Rapid movement", "Unusual pattern"][i % 5],
        details: "Deterministic sandbox monitoring rule.",
      },
    });
    await prisma.amlCase.create({
      data: { alertId: alert.id, status: i % 4 === 0 ? "investigating" : "open", riskLevel: i % 3 === 0 ? "high" : "medium" },
    });
  }

  for (let i = 0; i < 10; i += 1) {
    await prisma.reconciliationItem.create({
      data: {
        sourceA: "Internal Ledger",
        sourceB: ["Broker", "Custodian", "Payment Provider", "Bank"][i % 4],
        amountA: "18420120.00",
        amountB: i % 3 === 0 ? "18420118.00" : "18420120.00",
        currency: "GHS",
        difference: i % 3 === 0 ? "2.00" : "0.00",
        status: i % 3 === 0 ? "mismatch" : "matched",
      },
    });
  }

  const stages = [
    { id: "s0", name: "Stage 0 — Company / Strategy", owner: "Founders", status: "in_progress", sortOrder: 0 },
    { id: "s1", name: "Stage 1 — MVP / Validation", owner: "Product", status: "in_progress", sortOrder: 1 },
    { id: "s2", name: "Stage 2 — Regulatory Classification", owner: "Legal", status: "not_started", sortOrder: 2 },
    { id: "s3", name: "Stage 3 — Partner Readiness", owner: "Partnerships", status: "in_progress", sortOrder: 3 },
    { id: "s4", name: "Stage 4 — Compliance & Security", owner: "Compliance", status: "not_started", sortOrder: 4 },
    { id: "s5", name: "Stage 5 — Controlled Pilot", owner: "Operations", status: "not_started", sortOrder: 5 },
    { id: "s6", name: "Stage 6 — Ghana Launch", owner: "CEO", status: "not_started", sortOrder: 6 },
    { id: "s7", name: "Stage 7 — Diaspora Launch", owner: "Growth", status: "not_started", sortOrder: 7 },
    { id: "s8", name: "Stage 8 — Additional African Markets", owner: "Expansion", status: "not_started", sortOrder: 8 },
    { id: "s9", name: "Stage 9 — Global Markets", owner: "Expansion", status: "not_started", sortOrder: 9 },
  ];
  for (const s of stages) {
    await prisma.regulatoryStage.create({
      data: { ...s, description: `${s.name} is a planning stage. No licence is implied.` },
    });
  }

  const reqs = [
    { stageId: "s3", jurisdiction: "Ghana", institution: "SEC Ghana", requirement: "Broker identified", category: "partners", status: "in_progress", owner: "Partnerships", mandatory: true },
    { stageId: "s3", jurisdiction: "Ghana", institution: "Bank of Ghana", requirement: "PSP identified", category: "partners", status: "in_progress", owner: "Partnerships", mandatory: true },
    { stageId: "s3", jurisdiction: "Ghana", institution: "SEC Ghana", requirement: "Custody identified", category: "partners", status: "not_started", owner: "Partnerships", mandatory: true },
    { stageId: "s3", jurisdiction: "Ghana", institution: "Internal", requirement: "Partner due diligence", category: "partners", status: "not_started", owner: "Compliance", mandatory: true },
    { stageId: "s3", jurisdiction: "Ghana", institution: "Internal", requirement: "Commercial terms", category: "partners", status: "not_started", owner: "Partnerships", mandatory: true },
    { stageId: "s3", jurisdiction: "Ghana", institution: "Internal", requirement: "Integration documentation", category: "partners", status: "in_progress", owner: "Engineering", mandatory: true },
    { stageId: "s3", jurisdiction: "Ghana", institution: "Internal", requirement: "Contracts", category: "legal", status: "not_started", owner: "Legal", mandatory: true },
    { stageId: "s2", jurisdiction: "Ghana", institution: "SEC Ghana", requirement: "Securities activity classification", category: "licensing", status: "not_started", owner: "Legal", mandatory: true, notes: "Needs Legal Review" },
    { stageId: "s2", jurisdiction: "Sweden", institution: "Finansinspektionen", requirement: "Cross-border marketing assessment", category: "licensing", status: "not_started", owner: "Legal", mandatory: true, notes: "Needs Legal Review" },
    { stageId: "s2", jurisdiction: "European Union", institution: "National competent authority", requirement: "Whether service is offered into the EU", category: "licensing", status: "not_started", owner: "Legal", mandatory: true, notes: "Needs Legal Review" },
    { stageId: "s4", jurisdiction: "Ghana", institution: "FIC", requirement: "AML programme draft", category: "aml", status: "in_progress", owner: "MLRO", mandatory: true },
    { stageId: "s4", jurisdiction: "Ghana", institution: "Data Protection Commission", requirement: "Data protection assessment", category: "privacy", status: "not_started", owner: "DPO", mandatory: true },
    { stageId: "s0", jurisdiction: "Ghana", institution: "Registrar", requirement: "Company incorporation evidence", category: "corporate", status: "in_progress", owner: "Founders", mandatory: true },
  ];
  for (const r of reqs) {
    const created = await prisma.regulatoryRequirement.create({ data: r });
    await prisma.regulatoryEvidence.create({
      data: {
        requirementId: created.id,
        title: `${r.requirement} evidence`,
        type: "policy",
        status: r.status === "in_progress" ? "draft" : "missing",
        owner: r.owner,
      },
    });
  }

  const partners = [
    { company: "Candidate Ghana broker A", category: "Broker", market: "Ghana", status: "discussion" },
    { company: "Candidate PSP A", category: "PSP", market: "Ghana", status: "contacted" },
    { company: "Candidate custodian A", category: "Custodian", market: "Ghana", status: "candidate" },
    { company: "Candidate FX desk", category: "FX", market: "International", status: "candidate" },
    { company: "Candidate KYC vendor", category: "KYC", market: "International", status: "discussion" },
    { company: "Candidate market data", category: "Market Data", market: "Ghana", status: "candidate" },
    { company: "Candidate Ghana bank", category: "Bank", market: "Ghana", status: "contacted" },
    { company: "Candidate AML screening", category: "AML", market: "International", status: "candidate" },
  ];
  for (const p of partners) {
    await prisma.partner.create({
      data: {
        ...p,
        notes: "Candidate only. Not a contracted partner. Do not present as live integration.",
        contacts: { create: { name: "Business development", role: "BD", email: "bd@example.invalid" } },
        integrations: { create: { capability: p.category.toLowerCase(), state: "not_started" } },
      },
    });
  }

  await prisma.incident.create({
    data: {
      title: "Sandbox provider timeout (simulated)",
      severity: "low",
      status: "resolved",
      owner: "Engineering",
      summary: "Demo incident to exercise operations tooling.",
      rootCause: "Mock timeout injected in development.",
      resolution: "Retried successfully. No customer funds affected.",
      events: { create: { body: "Detected by synthetic check." } },
      actions: { create: { body: "Documented in runbook.", owner: "Engineering" } },
    },
  });

  await prisma.complaint.create({
    data: {
      userId: users[0].id,
      category: "funding",
      status: "acknowledged",
      priority: "medium",
      slaDueAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
      owner: "Support",
      summary: "Customer asked why an FX quote expired.",
      messages: { create: { author: "customer", body: "My quote disappeared." } },
    },
  });

  await prisma.waitlistEntry.createMany({
    data: [
      { email: "waitlist1@example.invalid", country: "Ghana", countryOfResidence: "Sweden", investorType: "diaspora", marketsInterested: "Ghana,Nigeria" },
      { email: "waitlist2@example.invalid", country: "Nigeria", countryOfResidence: "United Kingdom", investorType: "diaspora", marketsInterested: "Nigeria,Global Markets" },
      { email: "waitlist3@example.invalid", country: "Kenya", countryOfResidence: "Kenya", investorType: "resident", marketsInterested: "Kenya,Ghana" },
    ],
  });

  for (let i = 0; i < 100; i += 1) {
    const u = users[i % users.length];
    await prisma.notification.create({
      data: {
        userId: u.id,
        category: ["order", "dividend", "funding", "security", "portfolio", "market", "system"][i % 7],
        title: "Sandbox notification",
        body: "Fictional notification used to populate the activity centre.",
      },
    });
  }

  for (let i = 0; i < 140; i += 1) {
    const u = users[i % users.length];
    await prisma.order.create({
      data: {
        accountId: u.accountId,
        assetId: assetIds.MTNGH,
        side: "buy",
        quantity: String(10 + (i % 20)),
        filledQuantity: String(10 + (i % 20)),
        orderType: "market",
        estimatedValue: String((10 + (i % 20)) * 3.42),
        fees: "1.00",
        currency: "GHS",
        status: "settled",
        idempotencyKey: `seed:order:${i}`,
        submittedAt: new Date(Date.now() - i * 3600_000),
      },
    });
  }

  for (let i = 0; i < 180; i += 1) {
    const u = users[i % users.length];
    await prisma.transaction.create({
      data: {
        accountId: u.accountId,
        type: ["deposit", "fx", "investment", "fee", "dividend"][i % 5],
        status: "completed",
        amount: String(50 + i),
        currency: i % 2 === 0 ? "GHS" : "SEK",
        description: "Sandbox activity",
      },
    });
  }

  for (let i = 0; i < 8; i += 1) {
    await prisma.supportTicket.create({
      data: {
        userId: users[i].id,
        subject: "Question about fees",
        category: "fees",
        status: "open",
        body: "Mock support ticket.",
      },
    });
  }

  await prisma.fxRate.createMany({
    data: [
      { baseCurrency: "SEK", quoteCurrency: "GHS", sourceRate: "1.1640", spreadBps: "30" },
      { baseCurrency: "USD", quoteCurrency: "GHS", sourceRate: "10.85", spreadBps: "30" },
      { baseCurrency: "EUR", quoteCurrency: "GHS", sourceRate: "11.72", spreadBps: "30" },
      { baseCurrency: "GBP", quoteCurrency: "GHS", sourceRate: "13.91", spreadBps: "30" },
    ],
  });

  void assetIds;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
