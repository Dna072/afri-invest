# Financial system

## Ledger

Every money movement posts a balanced journal **per currency**. Customer cash is a **liability**. Safeguarded bank cash is an **asset**. Customer securities at custody are an **asset** with a matching **securities claim liability**. Platform fee income is **income**.

Opening a deposit:

- Debit `SAFE_BANK:{ccy}`
- Credit `CUST_CASH:{account}:{ccy}`

FX (completed):

- Debit customer cash + credit safeguarded bank in the sold currency (plus fee to revenue)
- Debit safeguarded bank + credit customer cash in the bought currency

Investment settlement:

- Debit customer cash / credit safeguarded bank (cash leaves)
- Debit investments at custody / credit securities claim
- Debit customer cash / credit trading revenue for the fee

## Invariants

- Debits = credits per currency
- Amounts > 0
- No silent `balance +=`
- Idempotency keys on deposits, withdrawals, FX, orders
- Reversals are new journals, not deletes

## Tests

See Vitest coverage for fees, FX, ledger balance, order transitions, portfolio derivation and stage gates.
