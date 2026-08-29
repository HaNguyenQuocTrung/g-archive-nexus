"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navigationItems = [
  {
    label: "Timelines",
    href: "/timelines",
  },
  {
    label: "Series",
    href: "/series",
  },
  {
    label: "Movies",
    href: "/movies",
  },
  {
    label: "Mobile Suits",
    href: "/mobile-suits",
  },
  {
    label: "Pilots",
    href: "/characters",
  },
  {
    label: "Search",
    href: "/search",
  },
];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        className={[
          "flex h-11 w-11 items-center justify-center",
          "border border-slate-700",
          "text-slate-300",
          "hover:border-cyan-400",
          "hover:text-cyan-400",
        ].join(" ")}
      >
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>

      {open && (
        <div
          className={[
            "absolute left-0 right-0 top-full z-50",
            "border-b border-slate-800",
            "bg-[#070A0F] px-6 py-5",
          ].join(" ")}
        >
          <nav className="space-y-2">
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center justify-between",
                  "border border-slate-800",
                  "bg-[#0F172A] px-4 py-4",
                  "font-mono text-xs uppercase",
                  "tracking-wider text-slate-400",
                  "hover:border-cyan-400/50",
                  "hover:text-cyan-400",
                ].join(" ")}
              >
                <span>{item.label}</span>

                <span className="text-slate-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
