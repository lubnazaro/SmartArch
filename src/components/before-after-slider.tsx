"use client";

import { useCallback, useRef, useState } from "react";
import { ProjectCoverImage } from "@/components/project-cover";
import { cn } from "@/lib/utils";

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const frame = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(98, Math.max(2, next)));
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  }

  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        ref={frame}
        className="relative aspect-[16/10] w-full cursor-col-resize touch-none overflow-hidden bg-sand-200 select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label={`${beforeLabel} / ${afterLabel} comparison`}
      >
        <div className="absolute inset-0">
          <ProjectCoverImage src={afterSrc} alt={afterLabel} sizes="100vw" />
        </div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <ProjectCoverImage src={beforeSrc} alt={beforeLabel} sizes="100vw" />
        </div>

        <div
          className="absolute inset-y-0 z-10 w-px bg-sand-50/90"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-sand-50/80 bg-ink/70 text-sand-50 backdrop-blur-sm">
            <span className="text-[10px] tracking-[0.2em] uppercase">⇄</span>
          </div>
        </div>

        <span className="pointer-events-none absolute start-4 bottom-4 text-[10px] uppercase tracking-[0.22em] text-sand-50/90">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute end-4 bottom-4 text-[10px] uppercase tracking-[0.22em] text-sand-50/90">
          {afterLabel}
        </span>
      </div>

      <input
        type="range"
        min={2}
        max={98}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="w-full accent-bronze"
        aria-label="Before and after position"
      />
    </div>
  );
}
