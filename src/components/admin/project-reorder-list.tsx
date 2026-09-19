"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import Link from "next/link";
import { reorderProjects } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  title: string;
  category: string;
  published: boolean;
  featured: boolean;
};

export function ProjectReorderList({
  initial,
}: {
  initial: Row[];
}) {
  const [items, setItems] = useState(initial);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function onDragStart(index: number) {
    setDragIndex(index);
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  function onDragEnd() {
    setDragIndex(null);
  }

  async function persist() {
    setSaving(true);
    setMessage(null);
    try {
      await reorderProjects(items.map((p) => p.id));
      setMessage("Order saved.");
    } catch {
      setMessage("Could not save order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft/70">
          Drag rows to reorder. Order is used on public project lists and the home carousel.
        </p>
        <button
          type="button"
          onClick={() => void persist()}
          disabled={saving}
          className="border border-ink/20 bg-ink px-4 py-2 text-sm text-sand-50 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save order"}
        </button>
      </div>
      {message ? <p className="text-sm text-bronze">{message}</p> : null}

      <div className="overflow-x-auto border border-sand-200">
        <table className="w-full text-sm">
          <thead className="bg-sand-100 text-start">
            <tr>
              <th className="w-10 px-2 py-3" />
              <th className="px-4 py-3 text-start font-medium">Title</th>
              <th className="px-4 py-3 text-start font-medium">Category</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-start font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, index) => (
              <tr
                key={p.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className={cn(
                  "border-t border-sand-200 bg-background",
                  dragIndex === index && "opacity-60"
                )}
              >
                <td className="px-2 py-3 text-ink-soft/40">
                  <GripVertical className="mx-auto h-4 w-4 cursor-grab" />
                </td>
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">
                  {p.published ? "Published" : "Draft"}
                  {p.featured ? " · Featured" : ""}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/projects/${p.id}`} className="underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink-soft/70">
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
