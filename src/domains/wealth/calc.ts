import Decimal from "decimal.js";

export function maturityValue(principal: Decimal.Value, yieldPercent: Decimal.Value, days: number) {
  const p = new Decimal(principal);
  const y = new Decimal(yieldPercent).div(100);
  return p.times(new Decimal(1).plus(y.times(days).div(365))).toFixed(2);
}

export function futureValue(initial: Decimal.Value, monthly: Decimal.Value, annualReturn: Decimal.Value, years: number) {
  const r = new Decimal(annualReturn).div(100).div(12);
  const n = years * 12;
  let value = new Decimal(initial);
  for (let i = 0; i < n; i += 1) {
    value = value.plus(monthly).times(new Decimal(1).plus(r));
  }
  return value.toFixed(2);
}

export function riskBand(input: {
  experience: string;
  horizon: string;
  objective: string;
  riskTolerance: string;
  liquidityNeeds: string;
}) {
  let score = 0;
  if (input.experience === "none") score += 0;
  else if (input.experience === "some") score += 1;
  else score += 2;
  if (input.horizon === "short") score += 0;
  else if (input.horizon === "medium") score += 1;
  else score += 2;
  if (input.objective === "preserve") score += 0;
  else if (input.objective === "balance") score += 1;
  else score += 2;
  if (input.riskTolerance === "low") score += 0;
  else if (input.riskTolerance === "medium") score += 1;
  else score += 2;
  if (input.liquidityNeeds === "high") score += 0;
  else score += 1;

  if (score <= 3) return { band: "Conservative", score };
  if (score <= 6) return { band: "Moderate", score };
  if (score <= 8) return { band: "Growth", score };
  return { band: "Aggressive growth", score };
}
