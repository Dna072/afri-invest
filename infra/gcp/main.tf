locals {
  name           = "africa-invest"
  is_production  = var.environment == "production"
  idle_sql       = var.enable_idle_sql_schedule && !local.is_production
  deletion_guard = coalesce(var.deletion_protection, local.is_production)
  labels = {
    app         = local.name
    environment = var.environment
    stack       = "lean-serverless"
  }
  apis = [
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "storage.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "serviceusage.googleapis.com",
    "cloudscheduler.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
  ]
}

resource "google_project_service" "apis" {
  for_each           = toset(local.apis)
  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

resource "random_id" "suffix" {
  byte_length = 2
}

resource "random_password" "db" {
  length  = 32
  special = false
}

resource "random_password" "session" {
  length  = 48
  special = false
}

resource "google_service_account" "run" {
  account_id   = "ai-run"
  display_name = "Africa Invest Cloud Run"
  depends_on   = [google_project_service.apis]
}

resource "google_service_account" "migrate" {
  account_id   = "ai-migrate"
  display_name = "Africa Invest Cloud Run migrate job"
  depends_on   = [google_project_service.apis]
}

resource "google_service_account" "ops" {
  account_id   = "ai-ops"
  display_name = "Africa Invest ops (SQL start/stop jobs)"
  depends_on   = [google_project_service.apis]
}

resource "google_service_account" "scheduler" {
  account_id   = "ai-scheduler"
  display_name = "Africa Invest Cloud Scheduler"
  depends_on   = [google_project_service.apis]
}

resource "google_artifact_registry_repository" "app" {
  location      = var.region
  repository_id = local.name
  description   = "Africa Invest Cloud Run images"
  format        = "DOCKER"
  labels        = local.labels
  depends_on    = [google_project_service.apis]

  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions {
      keep_count = 5
    }
  }

  cleanup_policies {
    id     = "delete-untagged"
    action = "DELETE"
    condition {
      tag_state  = "UNTAGGED"
      older_than = "86400s"
    }
  }
}

resource "google_sql_database_instance" "main" {
  name             = "${local.name}-${var.environment}-${random_id.suffix.hex}"
  database_version = "POSTGRES_16"
  region           = var.region
  project          = var.project_id

  deletion_protection = local.deletion_guard
  depends_on          = [google_project_service.apis]

  settings {
    tier              = var.sql_tier
    edition           = "ENTERPRISE"
    availability_type = "ZONAL"
    disk_type         = "PD_SSD"
    disk_size         = var.sql_disk_gb
    disk_autoresize   = true
    disk_autoresize_limit = var.sql_disk_autoresize_limit_gb
    user_labels       = local.labels

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = local.is_production
      start_time                     = "02:00"
      backup_retention_settings {
        retained_backups = local.is_production ? 14 : 7
      }
    }

    insights_config {
      query_insights_enabled = false
    }

    ip_configuration {
      ipv4_enabled = true
      ssl_mode     = "ALLOW_UNENCRYPTED_AND_ENCRYPTED"
    }

    maintenance_window {
      day          = 7
      hour         = 3
      update_track = "stable"
    }
  }

  lifecycle {
    ignore_changes = [settings[0].disk_size]
  }
}

resource "google_sql_database" "app" {
  name     = "africa_invest"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "app" {
  name     = "africa_invest"
  instance = google_sql_database_instance.main.name
  password = random_password.db.result
}

resource "google_secret_manager_secret" "database_url" {
  secret_id = "${local.name}-database-url"
  labels    = local.labels
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "database_url" {
  secret = google_secret_manager_secret.database_url.id
  secret_data = format(
    "postgresql://%s:%s@localhost/%s?host=/cloudsql/%s&connection_limit=3&pool_timeout=20",
    google_sql_user.app.name,
    random_password.db.result,
    google_sql_database.app.name,
    google_sql_database_instance.main.connection_name,
  )
}

resource "google_secret_manager_secret" "session" {
  secret_id = "${local.name}-session-secret"
  labels    = local.labels
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "session" {
  secret      = google_secret_manager_secret.session.id
  secret_data = random_password.session.result
}

resource "google_storage_bucket" "documents" {
  name                        = "${var.project_id}-${local.name}-docs-${var.environment}"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = !local.is_production
  labels                      = local.labels
  depends_on                  = [google_project_service.apis]

  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "AbortIncompleteMultipartUpload"
    }
  }
}

resource "google_storage_bucket_iam_member" "run_docs" {
  bucket = google_storage_bucket.documents.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.run.email}"
}

resource "google_project_iam_member" "run_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.run.email}"
}

resource "google_project_iam_member" "migrate_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.migrate.email}"
}

resource "google_secret_manager_secret_iam_member" "run_database_url" {
  secret_id = google_secret_manager_secret.database_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.run.email}"
}

resource "google_secret_manager_secret_iam_member" "migrate_database_url" {
  secret_id = google_secret_manager_secret.database_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.migrate.email}"
}

resource "google_secret_manager_secret_iam_member" "run_session" {
  secret_id = google_secret_manager_secret.session.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.run.email}"
}

resource "google_secret_manager_secret_iam_member" "cloudbuild_database_url" {
  secret_id  = google_secret_manager_secret.database_url.id
  role       = "roles/secretmanager.secretAccessor"
  member     = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_iam_member" "cloudbuild_session" {
  secret_id  = google_secret_manager_secret.session.id
  role       = "roles/secretmanager.secretAccessor"
  member     = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
  depends_on = [google_project_service.apis]
}

resource "google_project_iam_member" "ops_sql" {
  project = var.project_id
  role    = "roles/cloudsql.editor"
  member  = "serviceAccount:${google_service_account.ops.email}"
}

resource "google_project_iam_member" "cloudbuild_run" {
  project    = var.project_id
  role       = "roles/run.admin"
  member     = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
  depends_on = [google_project_service.apis]
}

resource "google_project_iam_member" "cloudbuild_ar" {
  project    = var.project_id
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
  depends_on = [google_project_service.apis]
}

resource "google_project_iam_member" "cloudbuild_sql" {
  project    = var.project_id
  role       = "roles/cloudsql.client"
  member     = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
  depends_on = [google_project_service.apis]
}

resource "google_service_account_iam_member" "cloudbuild_run_sa" {
  service_account_id = google_service_account.run.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
}

resource "google_service_account_iam_member" "cloudbuild_migrate_sa" {
  service_account_id = google_service_account.migrate.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
}

resource "google_cloud_run_v2_job" "sql_stop" {
  count    = local.idle_sql ? 1 : 0
  name     = "${local.name}-sql-stop"
  location = var.region
  labels   = local.labels
  depends_on = [
    google_project_service.apis,
    google_sql_database_instance.main,
  ]

  template {
    template {
      timeout          = "120s"
      max_retries      = 1
      service_account  = google_service_account.ops.email
      containers {
        image   = "gcr.io/google.com/cloudsdktool/google-cloud-cli:slim"
        command = ["gcloud"]
        args = [
          "sql", "instances", "patch", google_sql_database_instance.main.name,
          "--activation-policy=NEVER",
          "--quiet",
          "--project=${var.project_id}",
        ]
      }
    }
  }
}

resource "google_cloud_run_v2_job" "sql_start" {
  count    = local.idle_sql ? 1 : 0
  name     = "${local.name}-sql-start"
  location = var.region
  labels   = local.labels
  depends_on = [
    google_project_service.apis,
    google_sql_database_instance.main,
  ]

  template {
    template {
      timeout          = "180s"
      max_retries      = 1
      service_account  = google_service_account.ops.email
      containers {
        image   = "gcr.io/google.com/cloudsdktool/google-cloud-cli:slim"
        command = ["gcloud"]
        args = [
          "sql", "instances", "patch", google_sql_database_instance.main.name,
          "--activation-policy=ALWAYS",
          "--quiet",
          "--project=${var.project_id}",
        ]
      }
    }
  }
}

resource "google_cloud_run_v2_job_iam_member" "scheduler_stop" {
  count    = local.idle_sql ? 1 : 0
  name     = google_cloud_run_v2_job.sql_stop[0].name
  location = var.region
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.scheduler.email}"
}

resource "google_cloud_run_v2_job_iam_member" "scheduler_start" {
  count    = local.idle_sql ? 1 : 0
  name     = google_cloud_run_v2_job.sql_start[0].name
  location = var.region
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.scheduler.email}"
}

resource "google_cloud_scheduler_job" "sql_stop" {
  count     = local.idle_sql ? 1 : 0
  name      = "${local.name}-sql-stop"
  region    = var.region
  schedule  = var.sql_stop_schedule
  time_zone = var.scheduler_time_zone
  paused    = false
  depends_on = [
    google_cloud_run_v2_job_iam_member.scheduler_stop,
    google_project_service.apis,
  ]

  http_target {
    http_method = "POST"
    uri         = "https://${var.region}-run.googleapis.com/v2/projects/${var.project_id}/locations/${var.region}/jobs/${google_cloud_run_v2_job.sql_stop[0].name}:run"
    oauth_token {
      service_account_email = google_service_account.scheduler.email
      scope                 = "https://www.googleapis.com/auth/cloud-platform"
    }
  }
}

resource "google_cloud_scheduler_job" "sql_start" {
  count     = local.idle_sql ? 1 : 0
  name      = "${local.name}-sql-start"
  region    = var.region
  schedule  = var.sql_start_schedule
  time_zone = var.scheduler_time_zone
  paused    = false
  depends_on = [
    google_cloud_run_v2_job_iam_member.scheduler_start,
    google_project_service.apis,
  ]

  http_target {
    http_method = "POST"
    uri         = "https://${var.region}-run.googleapis.com/v2/projects/${var.project_id}/locations/${var.region}/jobs/${google_cloud_run_v2_job.sql_start[0].name}:run"
    oauth_token {
      service_account_email = google_service_account.scheduler.email
      scope                 = "https://www.googleapis.com/auth/cloud-platform"
    }
  }
}

resource "google_logging_project_bucket_config" "default" {
  project        = var.project_id
  location       = "global"
  bucket_id      = "_Default"
  retention_days = local.is_production ? 30 : 14
}

resource "google_project_service" "billing_budgets" {
  count              = var.billing_account_id == "" ? 0 : 1
  project            = var.project_id
  service            = "billingbudgets.googleapis.com"
  disable_on_destroy = false
}

resource "google_billing_budget" "lean" {
  count           = var.billing_account_id == "" ? 0 : 1
  billing_account = var.billing_account_id
  display_name    = "Africa Invest ${var.environment} lean cap"
  depends_on      = [google_project_service.billing_budgets]

  budget_filter {
    projects = ["projects/${data.google_project.current.number}"]
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = tostring(var.monthly_budget_usd)
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }
  threshold_rules {
    threshold_percent = 0.9
  }
  threshold_rules {
    threshold_percent = 1.0
  }
}
