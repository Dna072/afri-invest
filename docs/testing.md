# Testing

- Unit: money, fees, FX, ledger balance, order transitions, stage gates, RBAC, portfolio math (`npm run test`)
- Integration: payment/FX/order/KYC/AML/reconciliation services run against Prisma in development; demo controls exercise the same paths
- E2E: landing + Derrick login (`npm run test:e2e`)

Financial tests must not use JavaScript `number` addition for money.
