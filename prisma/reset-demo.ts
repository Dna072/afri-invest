import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import path from "node:path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
if (existsSync(dbPath)) unlinkSync(dbPath);
if (existsSync(`${dbPath}-journal`)) unlinkSync(`${dbPath}-journal`);
execSync("npx prisma db push --skip-generate --accept-data-loss", { stdio: "inherit" });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
console.log("Demo data reset.");
