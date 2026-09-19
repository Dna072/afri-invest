# GCP deployment

Africa Invest deploys as a **single Next.js service** on Google Cloud. The stack is intentionally small: serverless where that saves money, a tiny always-on database because a ledger cannot live in a scale-to-zero disk, and hard caps so a traffic spike cannot run up the bill.

This is **not** a live brokerage. Mock/sandbox providers stay on until real vendor contracts exist.

## What runs

```
Internet
  → Cloud Run (africa-invest)
       min instances = 0 (pay only while handling requests)
       max instances = 4 (cost cap)
       CPU allocated only during a request
       → Cloud SQL PostgreSQL (unix socket, no VPC connector)
       → Secret Manager (DATABASE_URL, SESSION_SECRET)
       → Cloud Storage (documents when DOCUMENT_PROVIDER=gcs)
  Cloud Run Job (migrate + optional seed) — runs only on deploy
  Cloud Scheduler + Cloud Run Jobs — optional overnight Cloud SQL pause (sandbox/staging)
```

| Piece | Why this, not the alternative |
| --- | --- |
| **Cloud Run** | Scale to zero. No GKE, no always-on VM, no global load balancer (~$18/month idle). HTTPS URL is included. |
| **Cloud SQL PostgreSQL `db-f1-micro` zonal** | Prisma/ledger need SQL. Firestore would rewrite the domain. No Serverless VPC connector (that has billed min instances). Public IP with **no authorized networks** — only the Cloud SQL connector can reach it. |
| **Secret Manager** | Session and DB URL never baked into the image. |
| **Artifact Registry** | Keeps the last 5 images; deletes untagged digest leftovers. |
| **Cloud Storage** | Document blobs. Uniform access, public access prevention. |
| **Cloud Build** | Builds in the cloud. No local Docker required. Free tier is 120 build-minutes/day. |
| **Not used** | GKE, Memorystore, Cloud CDN + HTTPS LB, Cloud NAT, Serverless VPC Access, Memorystore, Cloud Armor, always-on CPU on Cloud Run. |

Local development stays on **SQLite**. Docker/Cloud Build rewrites `prisma/schema.prisma` to PostgreSQL before generate/migrate.

## Cost shape (sandbox, `europe-west1`)

These are order-of-magnitude USD, not a quote. Check the [GCP pricing calculator](https://cloud.google.com/products/calculator).

| Resource | Idle (no traffic) | Light traffic |
| --- | --- | --- |
| Cloud Run (min 0, 1 vCPU / 1Gi, max 4) | **$0** | Often inside the free tier; a few dollars if busy |
| Cloud SQL `db-f1-micro` + 10 GB SSD | **~$8–12 / month** | Same (compute does not scale with requests) |
| Cloud SQL stopped overnight (default sandbox schedule) | Roughly **40% less** compute than 24/7 | App is down while SQL is stopped |
| Secret Manager, Artifact Registry, Cloud Storage, logging (14-day retention) | Cents | Cents |
| **Typical sandbox floor** | **~$10 / month** | **~$10–15 / month** |

Cloud SQL is the cost floor. Everything else is request-shaped. Do not add a load balancer, VPC connector, or Cloud Run `min-instances=1` unless cold starts become a product problem — each of those reintroduces idle spend.

Optional: set `billing_account_id` in `infra/gcp/terraform.tfvars` for a **$25/month** budget alert.

## Deploy

Needs: a GCP project with billing, `gcloud` authenticated (`gcloud auth login` and `gcloud auth application-default login`), Terraform >= 1.5.

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
export GCP_PROJECT_ID=YOUR_PROJECT_ID
export GCP_REGION=europe-west1          # optional, this is the default
export GCP_ENVIRONMENT=sandbox          # sandbox | staging | production

cp infra/gcp/terraform.tfvars.example infra/gcp/terraform.tfvars
# edit terraform.tfvars if you need a different SQL tier or budget

./scripts/deploy-gcp.sh                 # terraform apply + Cloud Build deploy
```

Commands:

| Command | Effect |
| --- | --- |
| `./scripts/deploy-gcp.sh plan` | Terraform plan |
| `./scripts/deploy-gcp.sh apply` | APIs, Cloud SQL, secrets, bucket, IAM, optional SQL sleep schedule |
| `./scripts/deploy-gcp.sh deploy` | Cloud Build: image, migrate, Cloud Run |
| `./scripts/deploy-gcp.sh pause` | Stop Cloud SQL now (compute off, disk still billed) |
| `./scripts/deploy-gcp.sh resume` | Start Cloud SQL |
| `./scripts/deploy-gcp.sh destroy` | Tear down (asks you to type the project id) |

The Cloud Run URL is printed at the end. Health: `GET /api/health`. Sandbox demo password remains `AfricaInvest!demo`.

If `db-f1-micro` is rejected in the region, set `sql_tier = "db-g1-small"` in `terraform.tfvars` (~2× the SQL bill, still small).

## Overnight SQL pause

Sandbox/staging **stop Cloud SQL at 21:00 and start it at 07:00 Europe/Stockholm** so the database is not billed while the team sleeps. Cloud Scheduler and the start/stop jobs scale to zero; they do not add idle cost.

The website returns errors while SQL is stopped. Pause the schedule in Cloud Scheduler, or set `enable_idle_sql_schedule = false`, for a demo that must stay up overnight. Production never uses this.

## Production

```bash
export GCP_ENVIRONMENT=production
./scripts/deploy-gcp.sh
```

That turns off demo login/controls, skips seed, keeps Cloud SQL running, enables PITR, and turns on deletion protection. Providers stay `mock` until sandbox vendor adapters exist. Raise `sql_tier` and `max_instances` only when metrics say you must.

## Operations notes

- Cloud Run instances use `connection_limit=3`. Max instances 4 ⇒ at most ~12 Prisma connections, inside `db-f1-micro` limits.
- Migrations run as a Cloud Run Job (`prisma db push`) on each deploy. Switch to `prisma migrate` before live money.
- Custom domains can be mapped later on Cloud Run without a load balancer.
- Cold start is the trade-off for `min-instances=0`. Set min instances to 1 only if that latency is worse than ~$10–20/month.
