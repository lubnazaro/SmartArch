import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { upsertProject } from "@/lib/actions";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { translations: true, media: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Edit project</h1>
      <div className="mt-8">
        <ProjectForm
          project={project}
          action={async (formData) => {
            "use server";
            formData.set("id", id);
            await upsertProject(formData);
            redirect(`/admin/projects/${id}`);
          }}
        />
      </div>
    </div>
  );
}
