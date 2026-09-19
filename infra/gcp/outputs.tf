output "region" {
  value = var.region
}

output "environment" {
  value = var.environment
}

output "artifact_registry" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}"
}

output "cloud_sql_instance" {
  value = google_sql_database_instance.main.name
}

output "cloud_sql_connection" {
  value = google_sql_database_instance.main.connection_name
}

output "documents_bucket" {
  value = google_storage_bucket.documents.name
}

output "run_service_account" {
  value = google_service_account.run.email
}

output "migrate_service_account" {
  value = google_service_account.migrate.email
}

output "database_url_secret" {
  value = google_secret_manager_secret.database_url.secret_id
}

output "session_secret_id" {
  value = google_secret_manager_secret.session.secret_id
}

output "idle_sql_schedule_enabled" {
  value = local.idle_sql
}

output "cloud_run_service" {
  value = "africa-invest"
}
