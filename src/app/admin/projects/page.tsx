import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { deleteProject } from "@/lib/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await prisma.project.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
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
      <div className="mt-8 overflow-x-auto border border-sand-200">
        <table className="w-full text-sm">
          <thead className="bg-sand-100 text-start">
            <tr>
              <th className="px-4 py-3 text-start font-medium">Title</th>
              <th className="px-4 py-3 text-start font-medium">Category</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-start font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const en = p.translations.find((t) => t.locale === "en");
              return (
                <tr key={p.id} className="border-t border-sand-200">
                  <td className="px-4 py-3">{en?.title || "Untitled"}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">
                    {p.published ? "Published" : "Draft"}
                    {p.featured ? " · Featured" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/admin/projects/${p.id}`} className="underline">
                        Edit
                      </Link>
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
                    </div>
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-ink-soft/70">
                  No projects yet. Create your first one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
