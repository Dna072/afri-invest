# Africa Invest

**Invest in Africa from anywhere.**  
One investment account for Africans everywhere.

Africa Invest is a production-minded MVP for a multi-market African investment platform, starting with **Ghana** and the **Ghanaian diaspora** (SEK → FX → GHS → Ghana portfolio).

This is not a throwaway prototype. Domain logic, ledger, provider interfaces, RBAC and audit exist so the product can move:

MVP → Validation → Sandbox integrations → Regulatory approval → Pilot → Production

without rewriting customer accounts, portfolio, orders or the ledger.

The application uses **sandbox / mock providers**. It is **not** a live brokerage. No licence, partnership, custody arrangement or regulatory approval is claimed.

## MVP scope

Customers can sign in, complete an educational investor profile, view multi-currency cash (ledger-derived), convert currency, explore African markets, view assets, manage a watchlist, place a sandbox investment, follow order lifecycle into portfolio, view dividends, Auto Invest, goals, activity, education, fees, security, documents and support.

Operations can review customers, KYC, AML, payments, withdrawals, orders, ledger, reconciliation, partners, regulatory stages/gates/evidence, complaints, incidents, audit, feature flags, analytics and demo controls.

## Technology

- Next.js App Router, TypeScript, Tailwind CSS, Radix primitives, Framer Motion, Recharts
- React Hook Form / Zod on APIs and forms
- Zustand for lightweight UI state
- Prisma + SQLite locally (PostgreSQL is the production target)
- Decimal.js for all money
- Vitest + Playwright

## Architecture

Modular monolith:

UI → Application services → Domain logic → Repositories → Provider adapters → External systems (mock today)

See `docs/architecture.md`.

## Domain model

Users have profiles, investor/tax/security profiles and accounts. Accounts hold currency balances (projections), positions, orders, transactions, documents and goals. The ledger is the source of truth for cash. Portfolio value = positions + market data + FX.

## Financial system

Double-entry journals, balanced per currency. Idempotency keys on money-moving APIs. State machines for payments and orders. Fees and FX quotes are structured objects, not hardcoded JSX.

## Provider architecture

`IDENTITY_PROVIDER`, `PAYMENT_PROVIDER`, `FX_PROVIDER`, `BROKER_PROVIDER`, `CUSTODY_PROVIDER`, `MARKET_DATA_PROVIDER`, `NOTIFICATION_PROVIDER`, `DOCUMENT_PROVIDER`, `TAX_PROVIDER` select implementations. MVP uses `mock`. Production classes can be added without changing customer UX.

## Security

HttpOnly session cookies (JWT), bcrypt passwords, RBAC enforced in API routes, security headers, rate-limit hooks via failed-login counters, audit events, `.env.example` with no secrets. Demo controls are environment-gated.

## Regulatory roadmap

See `docs/regulatory-roadmap.md`. Classification is **Needs Legal Review** until counsel says otherwise.

## Demo accounts

Password for all personas: `AfricaInvest!demo`

| Persona | Email | Story |
| --- | --- | --- |
| Derrick | derrick@africainvest.demo | Ghanaian in Sweden, SEK, Ghana portfolio |
| Ama | ama@africainvest.demo | Ghana resident, GHS |
| Kofi | kofi@africainvest.demo | Ghanaian in the UK, GBP |
| Chinedu | chinedu@africainvest.demo | Nigeria resident, NGN |
| Abena | ops@africainvest.demo | Operations admin |

All personal data is fictional.

## How to run

```bash
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm run dev
```

Open http://localhost:3000

### Cursor Cloud environment

Cloud Agents use `.cursor/environment.json`:

- **install** installs dependencies, creates `.env` from `.env.example`, pushes the Prisma schema, and seeds demo data if it is not already present
- **start** runs `npm run dev` on `0.0.0.0:3000` so the preview can reach the app

Save the environment from the Cursor dashboard after a successful environment build so new agents boot with the app ready. No production secrets are required for the sandbox.

## How to seed / reset demo

```bash
npm run seed
npm run reset-demo
```

## Testing

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Deployment

The app is a single Next.js deployable.

**Local / Cursor Cloud:** SQLite via `.env.example`.

**GCP (lean, scales with traffic):** Cloud Run (scale to zero) + Cloud SQL PostgreSQL + Secret Manager + Cloud Storage.

```bash
gcloud config set project YOUR_PROJECT_ID
export GCP_PROJECT_ID=YOUR_PROJECT_ID
./scripts/deploy-gcp.sh
```

See `docs/gcp-deployment.md` for architecture, cost floor, pause/resume, and production flags. Point `DATABASE_URL` at PostgreSQL in staging/production, rotate `SESSION_SECRET`, keep providers on `mock` until sandbox contracts exist. See `docs/production-migration.md`.

## Known limitations

- SQLite locally instead of managed PostgreSQL (Cloud SQL is the GCP production target; see `docs/gcp-deployment.md`)
- Mock providers only
- Sandbox market data, not live quotes
- No live KYC/AML vendors
- Educational investor profile ≠ regulated suitability
- PWA is installable, not a native app
- Illustrative fees and FX
- French localisation is architected via `src/i18n`, English copy ships first

## Product quality bar

Mobile-first (320–414, then desktop). Original visual identity (forest, gold, paper). Calm, not a trading casino. Trust through ledger, audit, fee transparency and honest “coming soon / candidate / needs legal review” language.
