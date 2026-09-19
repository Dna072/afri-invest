# Security

- Authentication: bcrypt passwords, JWT in httpOnly cookies, 7-day expiry
- Authorization: `src/lib/rbac.ts` permissions independent of roles; API routes call `requireUser` + `can`
- Headers: frame deny, nosniff, referrer, permissions-policy, CSP
- Secrets: `.env.example` only; never commit `.env`
- Audit: `AuditEvent` for login, payments, FX, orders, KYC, AML, admin
- Demo controls: `ENABLE_DEMO_CONTROLS` and never in `APP_ENV=production`
- Data classification fields on users/documents
- MFA / passkeys / biometrics: schema-ready, not fully enrolled in MVP
- Dependency scanning: `npm audit` in CI mindset; GitHub Action runs lint/test/build

We do **not** claim ISO 27001, SOC 2, NIST certification or PCI. Those are target practices.
