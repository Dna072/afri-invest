# Operations

- Structured JSON logs (`src/lib/logger.ts`) with request IDs on API errors
- GCP: Cloud Run + Cloud SQL. Overnight SQL pause on sandbox/staging. See `docs/gcp-deployment.md`.
- Audit timeline in admin
- Reconciliation exceptions with investigate/resolve/escalate statuses
- Incident + complaint modules with SLA fields
- Feature flags in database
- Demo reset: `npm run reset-demo` (non-production)

On-call and provider failover are documented as future runbooks, not fake dashboards claiming uptime SLAs.
