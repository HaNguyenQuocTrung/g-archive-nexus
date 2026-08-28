import Link from "next/link";
import { Database, Search } from "lucide-react";

import MobileNavigation from "./MobileNavigation";

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
    label: "Mobile Suits",
    href: "/mobile-suits",
  },
  {
    label: "Pilots",
    href: "/characters",
  },
];

export default function Header() {
  return (
    <header
      className={[
        "relative z-40 border-b border-slate-800",
        "bg-[#070A0F]/95 backdrop-blur",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-7xl",
          "items-center justify-between",
          "px-6 py-5",
        ].join(" ")}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            className={[
              "border border-cyan-400/50",
              "p-2 text-cyan-400",
            ].join(" ")}
          >
            <Database size={22} />
          </div>

          <div>
            <p
              className={[
                "font-mono text-base font-bold",
                "tracking-[0.18em]",
                "sm:text-lg sm:tracking-[0.2em]",
              ].join(" ")}
            >
              G-ARCHIVE NEXUS
            </p>

            <p
              className={[
                "hidden font-mono text-[10px]",
                "tracking-[0.25em] text-cyan-400",
                "sm:block",
              ].join(" ")}
            >
              MOBILE SUIT INTELLIGENCE DATABASE
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <nav
            className={[
              "hidden items-center gap-7",
              "font-mono text-xs uppercase",
              "tracking-wider text-slate-400",
              "md:flex",
            ].join(" ")}
          >
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-cyan-400"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/search"
              aria-label="Search archive"
              className={[
                "border border-slate-700 p-2",
                "hover:border-cyan-400",
                "hover:text-cyan-400",
              ].join(" ")}
            >
              <Search size={16} />
            </Link>
          </nav>

          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}