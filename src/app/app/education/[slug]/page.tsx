import { notFound } from "next/navigation";
import { AppShell } from "@/components/chrome/app-shell";
import { prisma } from "@/lib/db";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.educationArticle.findUnique({ where: { slug } });
  if (!article) notFound();
  return (
    <AppShell title={article.title}>
      <p className="text-xs text-muted-foreground">{article.category} · {article.readMinutes} min read</p>
      <p className="mt-6 max-w-2xl leading-7">{article.body}</p>
      <p className="mt-6 text-sm text-muted-foreground">Educational information only. This is not personalised investment advice.</p>
    </AppShell>
  );
}
