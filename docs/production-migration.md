# Production migration

For each subsystem: **Mock → Sandbox → Pilot → Production**.

Customer accounts, portfolio, ledger, order domain, fee engine, KYC/AML, reconciliation and the regulatory tower **stay**. Only the adapter behind the interface changes.

## Database

Local SQLite (`file:./dev.db`) → managed PostgreSQL on **Cloud SQL**. Prisma schema is written to be portable (string money, string enums). Docker/Cloud Build switches the Prisma provider to `postgresql` at image build time. First deploys use `prisma db push` via a Cloud Run Job; do not hand-edit production schema. Move to `prisma migrate` before live money.

## Secrets

`SESSION_SECRET` and `DATABASE_URL` live in **Secret Manager**. Never bake them into images.

## Infra

GCP is the deploy target: Cloud Run + Cloud SQL + Cloud Storage. See `docs/gcp-deployment.md`. Do not add GKE, a global HTTPS load balancer, or a Serverless VPC connector unless there is a concrete need — those recreate idle cost.

AWS, extra CDNs, WAF, queues, and workers remain future options. Boundaries exist (webhooks, domain events, document storage keys).

## Business continuity

Incidents, complaints and a wind-down evidence type exist as admin records. Full DR/BCP is documentation-first until production traffic exists.
