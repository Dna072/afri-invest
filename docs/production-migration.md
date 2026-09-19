# Production migration

For each subsystem: **Mock → Sandbox → Pilot → Production**.

Customer accounts, portfolio, ledger, order domain, fee engine, KYC/AML, reconciliation and the regulatory tower **stay**. Only the adapter behind the interface changes.

## Database

Local SQLite (`file:./dev.db`) → managed PostgreSQL. Prisma schema is written to be portable (string money, string enums). Run `prisma migrate` against PostgreSQL; do not hand-edit production schema.

## Secrets

Move `SESSION_SECRET` and future provider keys to a secrets manager. Never bake them into images.

## Infra later, not now

AWS, CDN, WAF, queues, object storage, workers, multi-region — boundaries exist (webhooks, domain events, document storage keys). Do not build them in MVP.

## Business continuity

Incidents, complaints and a wind-down evidence type exist as admin records. Full DR/BCP is documentation-first until production traffic exists.
