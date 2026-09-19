import { NextResponse } from "next/server";
import { apiErrorPayload } from "@/lib/errors";
import { requestId } from "@/lib/ids";

export async function apiRoute(fn: () => Promise<unknown>) {
  const id = requestId();
  try {
    const data = await fn();
    return NextResponse.json({ data, requestId: id });
  } catch (error) {
    const payload = apiErrorPayload(error, id);
    return NextResponse.json(payload.body, { status: payload.status });
  }
}
