"use client";

import type { Media, Project, ProjectTranslation } from "@prisma/client";
import {
  CoverUploader,
  MediaManager,
  mediaToDraft,
} from "@/components/admin/media-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/constants";

type ProjectData = Project & {
  translations: ProjectTranslation[];
  media: Media[];
};

function t(project: ProjectData | undefined, locale: string) {
  return project?.translations.find((x) => x.locale === locale);
}

export function ProjectForm({
  project,
  action,
}: {
  project?: ProjectData;
  action: (formData: FormData) => Promise<void>;
}) {
  const en = t(project, "en");
  const ar = t(project, "ar");
  const he = t(project, "he");
  const initialMedia = (project?.media || []).map(mediaToDraft);

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="id" value={project?.id || ""} />

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={project?.category || CATEGORIES.INTERIOR}
            className="flex h-9 w-full rounded-none border border-input bg-transparent px-3 text-sm"
          >
            <option value={CATEGORIES.SMART_HOME}>Smart Home</option>
            <option value={CATEGORIES.INTERIOR}>Interior Design</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={project?.location || ""}
            className="rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            defaultValue={project?.year || ""}
            className="rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={project?.sortOrder ?? 0}
            className="rounded-none"
          />
        </div>
        <div className="flex items-end gap-6 pb-2 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={project?.published}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured}
            />
            Featured on home
          </label>
        </div>
      </section>

      <section className="space-y-4 border border-sand-200 bg-sand-50/60 p-4">
        <h2 className="font-display text-xl">Cover image</h2>
        <CoverUploader initial={project?.coverUrl || ""} />
      </section>

      <section className="space-y-4 border border-sand-200 bg-sand-50/60 p-4">
        <h2 className="font-display text-xl">Before / After slider</h2>
        <p className="text-sm text-ink-soft/70">
          Optional. Upload both images to show an interactive comparison on the public project page.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <CoverUploader
            name="beforeImageUrl"
            initial={project?.beforeImageUrl || ""}
            label="Before image"
            helpText="Usually the existing or empty condition."
            buttonLabel="Upload before photo"
            clearLabel="Clear before"
            placeholder="/uploads/before.jpg"
          />
          <CoverUploader
            name="afterImageUrl"
            initial={project?.afterImageUrl || ""}
            label="After image"
            helpText="The completed design."
            buttonLabel="Upload after photo"
            clearLabel="Clear after"
            placeholder="/uploads/after.jpg"
          />
        </div>
      </section>

      <section className="space-y-4 border border-sand-200 p-4">
        <h2 className="font-display text-xl">English (required)</h2>
        <div className="space-y-2">
          <Label htmlFor="titleEn">Title</Label>
          <Input id="titleEn" name="titleEn" required defaultValue={en?.title || ""} className="rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slugEn">Slug</Label>
          <Input id="slugEn" name="slugEn" defaultValue={en?.slug || ""} placeholder="auto from title" className="rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summaryEn">Summary</Label>
          <Textarea id="summaryEn" name="summaryEn" defaultValue={en?.summary || ""} className="rounded-none" rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionEn">Description</Label>
          <Textarea id="descriptionEn" name="descriptionEn" defaultValue={en?.description || ""} className="rounded-none" rows={6} />
        </div>
      </section>

      <section className="space-y-4 border border-sand-200 p-4">
        <h2 className="font-display text-xl">Arabic (optional)</h2>
        <Input name="titleAr" placeholder="Title" defaultValue={ar?.title || ""} className="rounded-none" />
        <Input name="slugAr" placeholder="Slug" defaultValue={ar?.slug || ""} className="rounded-none" />
        <Textarea name="summaryAr" placeholder="Summary" defaultValue={ar?.summary || ""} className="rounded-none" rows={2} />
        <Textarea name="descriptionAr" placeholder="Description" defaultValue={ar?.description || ""} className="rounded-none" rows={4} />
      </section>

      <section className="space-y-4 border border-sand-200 p-4">
        <h2 className="font-display text-xl">Hebrew (optional)</h2>
        <Input name="titleHe" placeholder="Title" defaultValue={he?.title || ""} className="rounded-none" />
        <Input name="slugHe" placeholder="Slug" defaultValue={he?.slug || ""} className="rounded-none" />
        <Textarea name="summaryHe" placeholder="Summary" defaultValue={he?.summary || ""} className="rounded-none" rows={2} />
        <Textarea name="descriptionHe" placeholder="Description" defaultValue={he?.description || ""} className="rounded-none" rows={4} />
      </section>

      <section className="space-y-4 border border-sand-200 p-4">
        <h2 className="font-display text-xl">Project posts</h2>
        <p className="text-sm text-ink-soft/70">
          Add multiple posts — upload photos/videos to display them on the site, or paste Instagram
          URLs to embed posts and reels. Drag posts to reorder (or use Up/Down).
        </p>
        <MediaManager initial={initialMedia} />
      </section>

      <Button type="submit" className="rounded-none">
        Save project
      </Button>
    </form>
  );
}
