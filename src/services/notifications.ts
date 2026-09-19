import { prisma } from "@/lib/db";
import { getProviders } from "@/providers/registry";

export async function notify(input: {
  userId: string;
  category: string;
  title: string;
  body: string;
  channel?: "in_app" | "email" | "push" | "sms";
}) {
  await prisma.notification.create({
    data: {
      userId: input.userId,
      category: input.category,
      title: input.title,
      body: input.body,
      channel: input.channel ?? "in_app",
    },
  });
  await getProviders().notifications.send({
    userId: input.userId,
    category: input.category,
    title: input.title,
    body: input.body,
    channel: input.channel ?? "in_app",
  });
}
