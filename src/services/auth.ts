import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";
import type { Role } from "@/types/enums";
import { recordAudit } from "@/services/audit";

const COOKIE = "ai_session";
const secret = new TextEncoder().encode(env.SESSION_SECRET);

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  displayName: string;
  primaryCurrency: string;
  countryOfResidence: string;
  nationality: string;
  personaKey: string | null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: { id: string; role: string }, meta?: { ip?: string; userAgent?: string }) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const token = await new SignJWT({ sub: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: token.slice(-48),
      ip: meta?.ip,
      userAgent: meta?.userAgent,
      expiresAt,
    },
  });

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.APP_ENV === "production" || env.APP_URL.startsWith("https://"),
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const user = await prisma.user.findUnique({ where: { id: String(payload.sub) } });
    if (!user || user.status !== "active" || user.deletedAt) return null;
    return {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      primaryCurrency: user.primaryCurrency,
      countryOfResidence: user.countryOfResidence,
      nationality: user.nationality,
      personaKey: user.personaKey,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await readSession();
  if (!user) throw new AppError("UNAUTHENTICATED", "Please sign in to continue.", 401);
  return user;
}

export async function loginWithPassword(email: string, password: string, meta?: { ip?: string }) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { securityProfile: true },
  });
  if (!user) {
    await recordAudit({ action: "FAILED_LOGIN", entity: "user", metadata: { email } });
    throw new AppError("INVALID_CREDENTIALS", "Email or password is incorrect.", 401);
  }
  if (user.securityProfile?.lockedUntil && user.securityProfile.lockedUntil > new Date()) {
    throw new AppError("ACCOUNT_LOCKED", "Too many failed attempts. Try again later.", 429);
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    await prisma.securityProfile.update({
      where: { userId: user.id },
      data: { failedLoginCount: { increment: 1 } },
    });
    await recordAudit({ action: "FAILED_LOGIN", entity: "user", entityId: user.id });
    throw new AppError("INVALID_CREDENTIALS", "Email or password is incorrect.", 401);
  }
  await prisma.securityProfile.update({
    where: { userId: user.id },
    data: { failedLoginCount: 0, lockedUntil: null },
  });
  await createSession(user, meta);
  await recordAudit({ action: "LOGIN", entity: "user", entityId: user.id, actorId: user.id, result: "success" });
  return user;
}

export async function loginDemoPersona(personaKey: string) {
  if (env.ENABLE_DEMO_LOGIN !== "true" || env.APP_ENV === "production") {
    throw new AppError("DEMO_DISABLED", "Demo login is disabled in this environment.", 403);
  }
  const user = await prisma.user.findUnique({ where: { personaKey } });
  if (!user) throw new AppError("PERSONA_NOT_FOUND", "Unknown demo persona.", 404);
  await createSession(user);
  await recordAudit({ action: "LOGIN", entity: "user", entityId: user.id, actorId: user.id, metadata: { demo: true } });
  return user;
}
