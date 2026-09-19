"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/constants";
import {
  pickProjectTranslation,
  type ProjectWithRelations,
} from "@/lib/content";
import { isUsableCoverUrl } from "@/lib/media";
import { ProjectCoverImage } from "@/components/project-cover";
import { cn } from "@/lib/utils";

export function SignatureCarousel({
  projects,
  locale,
  exploreLabel,
}: {
  projects: ProjectWithRelations[];
  locale: Locale;
  exploreLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const count = projects.length;
  if (count === 0) return null;

  const project = projects[index];
  const t = pickProjectTranslation(project, locale);
  if (!t) return null;

  const href = `/${locale}/projects/${t.slug}`;
  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + count) % count);
  };

  return (
    <div className="relative">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand-200 sm:aspect-[21/10]">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {isUsableCoverUrl(project.coverUrl) && project.coverUrl ? (
              <ProjectCoverImage
                src={project.coverUrl}
                alt={t.title}
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            ) : (
              <div className="arch-grid h-full" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10 md:p-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={`copy-${project.id}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-sand-50/70">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </p>
              <h3 className="mt-3 max-w-2xl font-display text-3xl text-sand-50 sm:text-5xl md:text-6xl">
                {t.title}
              </h3>
              {t.summary ? (
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-sand-50/75 sm:text-base">
                  {t.summary}
                </p>
              ) : null}
              <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 text-sm tracking-wide text-sand-50 transition-opacity hover:opacity-80"
              >
                {exploreLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {count > 1 ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center border border-sand-300/80 text-ink-soft/70",
                "transition-colors hover:border-bronze/50 hover:text-ink"
              )}
              aria-label="Previous project"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center border border-sand-300/80 text-ink-soft/70",
                "transition-colors hover:border-bronze/50 hover:text-ink"
              )}
              aria-label="Next project"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-1.5">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to project ${i + 1}`}
                className={cn(
                  "h-px w-8 transition-all",
                  i === index ? "bg-bronze" : "bg-sand-300/80 hover:bg-sand-400"
                )}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
