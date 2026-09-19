variable "project_id" {
  type        = string
  description = "GCP project that will host Africa Invest."
}

variable "region" {
  type        = string
  description = "Single region for Cloud Run, Cloud SQL, Artifact Registry, and Cloud Storage. europe-west1 is a cost-efficient default for Ghana + EU diaspora latency."
  default     = "europe-west1"
}

variable "environment" {
  type        = string
  description = "sandbox | staging | production. Controls demo flags, SQL idle schedule, and deletion protection."
  default     = "sandbox"

  validation {
    condition     = contains(["sandbox", "staging", "production"], var.environment)
    error_message = "environment must be sandbox, staging, or production."
  }
}

variable "sql_tier" {
  type        = string
  description = "Cloud SQL machine type. db-f1-micro is the cheapest PostgreSQL shared-core SKU. Raise to db-g1-small if the region rejects f1-micro."
  default     = "db-f1-micro"
}

variable "sql_disk_gb" {
  type        = number
  description = "Starting Cloud SQL SSD size in GB. Autoresize is capped separately."
  default     = 10
}

variable "sql_disk_autoresize_limit_gb" {
  type        = number
  description = "Hard cap on Cloud SQL disk growth so a runaway log cannot explode cost."
  default     = 25
}

variable "max_instances" {
  type        = number
  description = "Cloud Run max instances. Caps worst-case compute spend under a traffic spike."
  default     = 4
}

variable "cpu" {
  type        = string
  description = "Cloud Run vCPU per instance. 1 is enough for the Next.js monolith at this stage."
  default     = "1"
}

variable "memory" {
  type        = string
  description = "Cloud Run memory. 1Gi avoids Next.js + Prisma cold-start OOMs without paying for 2Gi."
  default     = "1Gi"
}

variable "enable_idle_sql_schedule" {
  type        = bool
  description = "Stop Cloud SQL overnight (sandbox/staging) so the always-on database is not billed 24/7. Forced off in production."
  default     = true
}

variable "sql_stop_schedule" {
  type        = string
  description = "Cron for pausing Cloud SQL. Default 21:00 Europe/Stockholm."
  default     = "0 21 * * *"
}

variable "sql_start_schedule" {
  type        = string
  description = "Cron for resuming Cloud SQL. Default 07:00 Europe/Stockholm."
  default     = "0 7 * * *"
}

variable "scheduler_time_zone" {
  type        = string
  description = "Time zone for the optional Cloud SQL idle schedule."
  default     = "Europe/Stockholm"
}

variable "billing_account_id" {
  type        = string
  description = "Optional billing account (XXXXXX-XXXXXX-XXXXXX) to create a budget alert. Leave empty to skip."
  default     = ""
}

variable "monthly_budget_usd" {
  type        = number
  description = "Budget alert threshold in USD. The lean sandbox floor is roughly $8–15; $25 leaves headroom for traffic."
  default     = 25
}

variable "deletion_protection" {
  type        = bool
  description = "Protect the Cloud SQL instance from terraform destroy. Default on for production via locals."
  default     = null
}
