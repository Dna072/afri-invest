import { nanoid } from "nanoid";

export function requestId() {
  return `req_${nanoid(16)}`;
}

export function idempotencyKey(prefix = "ik") {
  return `${prefix}_${nanoid(24)}`;
}

export function publicId(prefix: string) {
  return `${prefix}_${nanoid(12)}`;
}
