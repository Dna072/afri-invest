import Link from "next/link";
import { AppShell } from "@/components/chrome/app-shell";
import { prisma } from "@/lib/db";

export default async function EducationPage() {
  const articles = await prisma.educationArticle.findMany({ orderBy: { category: "asc" } });
  return (
    <AppShell title="Learn">
      <p className="text-sm text-muted-foreground">Educational content only. Not personalised advice. Structure is CMS-ready.</p>
      <ul className="mt-6 space-y-2">
        {articles.map((a) => (
          <li key={a.id}>
            <Link href={`/app/education/${a.slug}`} className="block rounded-2xl bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">{a.category} · {a.readMinutes} min</p>
              <p className="font-medium">{a.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
