#!/usr/bin/env node
/**
 * Cloud Run Job entrypoint: push the Prisma schema to Cloud SQL, optionally seed sandbox data.
 */
import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "db", "push", "--skip-generate", "--accept-data-loss"]);

if (process.env.GCP_RUN_SEED === "true") {
  run("npx", ["tsx", "prisma/seed.ts"]);
}

console.log("Cloud SQL schema is ready");
