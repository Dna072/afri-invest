# Domain model

Core aggregates: User (profile, investor, tax, security, KYC, privacy) → Account → currency balances, positions, orders, payments, FX, dividends, Auto Invest, documents, goals.

Supporting: Market / Exchange / Asset / TradingCalendar; LedgerAccount / LedgerTransaction / LedgerEntry; AML alerts/cases; Regulatory stages/requirements/evidence; Partners; Reconciliation; Incidents; Complaints; Feature flags; Audit and domain events; Webhooks.

Money is always `(amount string, currency code)`. Never `user.balance`.
