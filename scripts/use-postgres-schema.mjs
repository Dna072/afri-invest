#!/usr/bin/env node
/**
 * Cloud SQL uses PostgreSQL. Local MVP keeps SQLite in prisma/schema.prisma.
 * Docker/Cloud Build rewrites the datasource provider before generate/migrate.
 */
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../prisma/schema.prisma", import.meta.url);
let schema = readFileSync(path, "utf8");

if (!schema.includes('provider = "sqlite"')) {
  if (schema.includes('provider = "postgresql"')) {
    console.log("Prisma datasource already set to postgresql");
    process.exit(0);
  }
  console.error("Expected prisma/schema.prisma to use the sqlite provider");
  process.exit(1);
}

schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
writeFileSync(path, schema);
console.log("Prisma datasource set to postgresql");
