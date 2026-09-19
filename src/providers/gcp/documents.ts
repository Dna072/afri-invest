import { env } from "@/lib/env";
import type { DocumentProvider } from "@/providers/types";

async function metadataAccessToken() {
  const response = await fetch(
    "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
    { headers: { "Metadata-Flavor": "Google" }, cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error("Could not obtain GCP metadata access token for Cloud Storage");
  }
  const payload = (await response.json()) as { access_token: string };
  return payload.access_token;
}

function bucketName() {
  if (!env.GCS_BUCKET) {
    throw new Error("GCS_BUCKET is required when DOCUMENT_PROVIDER=gcs");
  }
  return env.GCS_BUCKET;
}

export class GcsDocumentProvider implements DocumentProvider {
  async store(input: { key: string; contentType: string; body: string }) {
    const token = await metadataAccessToken();
    const object = encodeURIComponent(input.key);
    const response = await fetch(
      `https://storage.googleapis.com/upload/storage/v1/b/${bucketName()}/o?uploadType=media&name=${object}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": input.contentType || "application/octet-stream",
        },
        body: input.body,
      },
    );
    if (!response.ok) {
      throw new Error(`Cloud Storage upload failed (${response.status})`);
    }
    return { storageKey: input.key };
  }

  async get(storageKey: string) {
    const token = await metadataAccessToken();
    const object = encodeURIComponent(storageKey);
    const response = await fetch(
      `https://storage.googleapis.com/storage/v1/b/${bucketName()}/o/${object}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (response.status === 404) {
      return { body: "", contentType: "text/plain" };
    }
    if (!response.ok) {
      throw new Error(`Cloud Storage download failed (${response.status})`);
    }
    return {
      body: await response.text(),
      contentType: response.headers.get("content-type") ?? "application/octet-stream",
    };
  }
}
