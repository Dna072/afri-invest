import Decimal from "decimal.js";
import type { CurrencyCode } from "@/types/enums";

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_EVEN });

const DECIMALS: Record<string, number> = {
  GHS: 2,
  USD: 2,
  EUR: 2,
  GBP: 2,
  SEK: 2,
  NGN: 2,
  KES: 2,
  ZAR: 2,
  XOF: 0,
};

export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MoneyError";
  }
}

export class Money {
  readonly amount: Decimal;
  readonly currency: CurrencyCode;

  constructor(amount: Decimal.Value, currency: CurrencyCode) {
    const value = new Decimal(amount);
    if (!value.isFinite()) {
      throw new MoneyError("Amount must be a finite decimal");
    }
    this.currency = currency;
    this.amount = value.toDecimalPlaces(DECIMALS[currency] ?? 2);
  }

  static from(amount: Decimal.Value, currency: CurrencyCode) {
    return new Money(amount, currency);
  }

  static zero(currency: CurrencyCode) {
    return new Money(0, currency);
  }

  private assertSame(other: Money) {
    if (this.currency !== other.currency) {
      throw new MoneyError(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  add(other: Money) {
    this.assertSame(other);
    return new Money(this.amount.plus(other.amount), this.currency);
  }

  sub(other: Money) {
    this.assertSame(other);
    return new Money(this.amount.minus(other.amount), this.currency);
  }

  mul(factor: Decimal.Value) {
    return new Money(this.amount.times(factor), this.currency);
  }

  allocate(ratio: Decimal.Value) {
    return new Money(this.amount.times(ratio), this.currency);
  }

  gt(other: Money) {
    this.assertSame(other);
    return this.amount.gt(other.amount);
  }

  gte(other: Money) {
    this.assertSame(other);
    return this.amount.gte(other.amount);
  }

  lt(other: Money) {
    this.assertSame(other);
    return this.amount.lt(other.amount);
  }

  eq(other: Money) {
    this.assertSame(other);
    return this.amount.eq(other.amount);
  }

  isZero() {
    return this.amount.isZero();
  }

  isNegative() {
    return this.amount.isNegative();
  }

  isPositive() {
    return this.amount.gt(0);
  }

  abs() {
    return new Money(this.amount.abs(), this.currency);
  }

  toFixed() {
    return this.amount.toFixed(DECIMALS[this.currency] ?? 2);
  }

  toNumberUnsafe() {
    return this.amount.toNumber();
  }

  toJSON() {
    return { amount: this.toFixed(), currency: this.currency };
  }
}

export function currencyDecimals(code: string) {
  return DECIMALS[code] ?? 2;
}

export function formatMoney(amount: Decimal.Value, currency: string, locale = "en-GB") {
  const decimals = currencyDecimals(currency);
  const value = new Decimal(amount).toFixed(decimals);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "code",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(Number(value));
  } catch {
    return `${currency} ${value}`;
  }
}

export function formatSignedPercent(value: Decimal.Value) {
  const d = new Decimal(value);
  const sign = d.gt(0) ? "+" : "";
  return `${sign}${d.toFixed(2)}%`;
}

export function sumMoney(items: Money[], currency: CurrencyCode) {
  return items.reduce((acc, item) => acc.add(item), Money.zero(currency));
}
