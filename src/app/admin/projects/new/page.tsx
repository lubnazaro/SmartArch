import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { upsertProject } from "@/lib/actions";
import { ProjectForm } from "@/components/admin/project-form";

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-3xl">New project</h1>
      <div className="mt-8">
        <ProjectForm
          action={async (formData) => {
            "use server";
            const id = await upsertProject(formData);
            redirect(`/admin/projects/${id}`);
          }}
        />
      </div>
    </div>
  );
}
