"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion";

export function FaqAccordion({
  items,
}: {
  items: { id: string; question: string; answer: string }[];
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-sand-200 border-y border-sand-200">
      {items.map((item, i) => {
        const open = openId === item.id;
        return (
          <FadeIn key={item.id} delay={i * 0.05} y={12}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 py-6 text-start"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
            >
              <span className="font-display text-xl text-ink sm:text-2xl">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "mt-1 h-5 w-5 shrink-0 text-bronze transition-transform duration-300",
                  open && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-6 whitespace-pre-wrap text-ink-soft/80 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
