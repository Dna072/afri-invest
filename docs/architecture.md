# Architecture

Africa Invest is a **modular monolith**. One deployable Next.js application. Domain folders under `src/domains`, application services under `src/services`, provider ports under `src/providers`.

```
UI (App Router)
  → Application services
    → Domain logic (Decimal money, state machines, fees, FX, gates)
      → Prisma repositories
        → Provider adapters (mock | future sandbox | future production)
          → External systems
```

## Source of truth

| Concern | Source |
| --- | --- |
| Cash balances | Ledger (customer cash liability accounts). `CurrencyBalance` is a projection. |
| Portfolio | Positions + sandbox market data + FX conversion to reporting currency |
| Activity | `Transaction` + `Notification` + `AuditEvent` |
| AUM | Sum of customer positions (market value) |
| Revenue | `RevenueEvent` written when fees post |

## Environments

`development` `test` `staging` `sandbox` `production` via `APP_ENV`.

Providers are selected with `*_PROVIDER=mock` (default). Domain code never imports a concrete PSP.

## Why not microservices

There is no scale, team or regulatory perimeter that yet justifies splitting Identity, Payments, FX, Trading, Ledger or Compliance. Boundaries are already drawn so those slices can be extracted later.

## Native apps

Business rules live in services and `/api/v1/*`. A future React Native client should consume the same APIs.
