import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { deleteProject } from "@/lib/actions";
import { ProjectReorderList } from "@/components/admin/project-reorder-list";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await prisma.project.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const rows = projects.map((p) => {
    const en = p.translations.find((t) => t.locale === "en");
    return {
      id: p.id,
      title: en?.title || "Untitled",
      category: p.category,
      published: p.published,
      featured: p.featured,
    };
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Projects</h1>
        <Link
          href="/admin/projects/new"
          className={cn(buttonVariants(), "rounded-none")}
        >
          New project
        </Link>
      </div>

      <ProjectReorderList initial={rows} />

      {projects.length > 0 ? (
        <div className="mt-6 space-y-2 border-t border-sand-200 pt-6">
          <p className="text-xs uppercase tracking-[0.16em] text-bronze">Quick delete</p>
          <ul className="space-y-1 text-sm">
            {projects.map((p) => {
              const en = p.translations.find((t) => t.locale === "en");
              return (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <span className="text-ink-soft/80">{en?.title || "Untitled"}</span>
                  <form
                    action={async () => {
                      "use server";
                      await deleteProject(p.id);
                    }}
                  >
                    <button type="submit" className="text-red-700 underline">
                      Delete
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
