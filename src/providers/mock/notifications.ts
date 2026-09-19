import { nanoid } from "nanoid";
import type { NotificationProvider } from "@/providers/types";

export class MockNotificationProvider implements NotificationProvider {
  async send() {
    return { id: `ntf_${nanoid(10)}`, status: "sent" as const };
  }
}
