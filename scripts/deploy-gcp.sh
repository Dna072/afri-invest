#!/usr/bin/env bash
# Deploy Africa Invest to GCP: Cloud Run (scale-to-zero) + Cloud SQL + Secret Manager + Cloud Storage.
# Usage:
#   ./scripts/deploy-gcp.sh              # terraform apply + Cloud Build deploy
#   ./scripts/deploy-gcp.sh plan
#   ./scripts/deploy-gcp.sh apply
#   ./scripts/deploy-gcp.sh deploy
#   ./scripts/deploy-gcp.sh pause        # stop Cloud SQL (sandbox cost saver)
#   ./scripts/deploy-gcp.sh resume
#   ./scripts/deploy-gcp.sh destroy
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA="${ROOT}/infra/gcp"
COMMAND="${1:-all}"

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

need gcloud
need terraform

PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "Set GCP_PROJECT_ID or run: gcloud config set project YOUR_PROJECT" >&2
  exit 1
fi

REGION="${GCP_REGION:-europe-west1}"
ENVIRONMENT="${GCP_ENVIRONMENT:-sandbox}"
TFVARS="${INFRA}/terraform.tfvars"
STATE_BUCKET="${PROJECT_ID}-africa-invest-tfstate"

if [[ ! "${ENVIRONMENT}" =~ ^(sandbox|staging|production)$ ]]; then
  echo "GCP_ENVIRONMENT must be sandbox, staging, or production" >&2
  exit 1
fi

gcloud config set project "${PROJECT_ID}" >/dev/null

tf_args() {
  local extra=()
  if [[ -f "${TFVARS}" ]]; then
    extra+=(-var-file="${TFVARS}")
  fi
  extra+=(-var="project_id=${PROJECT_ID}")
  extra+=(-var="region=${REGION}")
  extra+=(-var="environment=${ENVIRONMENT}")
  printf '%s\n' "${extra[@]}"
}

ensure_state_bucket() {
  if ! gcloud storage buckets describe "gs://${STATE_BUCKET}" >/dev/null 2>&1; then
    echo "Creating Terraform state bucket gs://${STATE_BUCKET}"
    gcloud storage buckets create "gs://${STATE_BUCKET}" \
      --project="${PROJECT_ID}" \
      --location="${REGION}" \
      --uniform-bucket-level-access
    gcloud storage buckets update "gs://${STATE_BUCKET}" --versioning --quiet
  fi
}

tf_init() {
  ensure_state_bucket
  terraform -chdir="${INFRA}" init -reconfigure \
    -backend-config="bucket=${STATE_BUCKET}" \
    -backend-config="prefix=africa-invest/${ENVIRONMENT}"
}

tf_output() {
  terraform -chdir="${INFRA}" output -raw "$1"
}

sql_instance() {
  tf_output cloud_sql_instance
}

cmd_plan() {
  tf_init
  mapfile -t args < <(tf_args)
  terraform -chdir="${INFRA}" plan "${args[@]}"
}

cmd_apply() {
  gcloud services enable serviceusage.googleapis.com cloudresourcemanager.googleapis.com --project="${PROJECT_ID}"
  tf_init
  mapfile -t args < <(tf_args)
  terraform -chdir="${INFRA}" apply -auto-approve "${args[@]}"
  echo
  echo "Infrastructure ready."
  echo "  Cloud SQL:     $(tf_output cloud_sql_instance)"
  echo "  Registry:      $(tf_output artifact_registry)"
  echo "  Docs bucket:   $(tf_output documents_bucket)"
  echo "  SQL idle stop: $(tf_output idle_sql_schedule_enabled)"
}

cmd_deploy() {
  need gcloud
  local image_base sql_conn run_sa migrate_sa bucket
  image_base="$(tf_output artifact_registry)"
  sql_conn="$(tf_output cloud_sql_connection)"
  run_sa="$(tf_output run_service_account)"
  migrate_sa="$(tf_output migrate_service_account)"
  bucket="$(tf_output documents_bucket)"
  local seed="true"
  if [[ "${ENVIRONMENT}" == "production" ]]; then
    seed="false"
  fi
  echo "Submitting Cloud Build for ${ENVIRONMENT} in ${REGION}…"
  gcloud builds submit "${ROOT}" \
    --config="${ROOT}/cloudbuild.yaml" \
    --substitutions="_REGION=${REGION},_AR_REPO=africa-invest,_SERVICE=africa-invest,_ENV=${ENVIRONMENT},_SEED=${seed},_SQL_CONNECTION=${sql_conn},_RUN_SA=${run_sa},_MIGRATE_SA=${migrate_sa},_GCS_BUCKET=${bucket},_DB_SECRET=africa-invest-database-url,_SESSION_SECRET=africa-invest-session-secret"
  local url
  url="$(gcloud run services describe africa-invest --region="${REGION}" --format='value(status.url)')"
  echo
  echo "Africa Invest is on Cloud Run:"
  echo "  ${url}"
  echo "  Health: ${url}/api/health"
  if [[ "${ENVIRONMENT}" != "production" ]]; then
    echo "  Demo password: AfricaInvest!demo"
  fi
  echo "  Registry images: ${image_base}"
}

cmd_pause() {
  echo "Stopping Cloud SQL $(sql_instance) (storage is still billed; compute is not)"
  gcloud sql instances patch "$(sql_instance)" --activation-policy=NEVER --quiet
}

cmd_resume() {
  echo "Starting Cloud SQL $(sql_instance)"
  gcloud sql instances patch "$(sql_instance)" --activation-policy=ALWAYS --quiet
}

cmd_destroy() {
  echo "This deletes Cloud SQL, secrets, the docs bucket (non-prod), and related IAM."
  read -r -p "Type the project id (${PROJECT_ID}) to confirm: " confirm
  if [[ "${confirm}" != "${PROJECT_ID}" ]]; then
    echo "Aborted"
    exit 1
  fi
  tf_init
  mapfile -t args < <(tf_args)
  args+=(-var="deletion_protection=false")
  terraform -chdir="${INFRA}" destroy "${args[@]}"
}

case "${COMMAND}" in
  plan) cmd_plan ;;
  apply) cmd_apply ;;
  deploy) cmd_deploy ;;
  pause) cmd_pause ;;
  resume) cmd_resume ;;
  destroy) cmd_destroy ;;
  all)
    cmd_apply
    cmd_deploy
    ;;
  *)
    echo "Unknown command: ${COMMAND}" >&2
    echo "Usage: $0 [all|plan|apply|deploy|pause|resume|destroy]" >&2
    exit 1
    ;;
esac
