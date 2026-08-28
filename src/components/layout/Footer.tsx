import Link from "next/link";
import { Code2 } from "lucide-react";
import { Cinzel_Decorative } from "next/font/google";

const footerLinks = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Timelines",
    href: "/timelines",
  },
  {
    label: "Mobile Suits",
    href: "/mobile-suits",
  },
  {
    label: "Search",
    href: "/search",
  },
];

export default function Footer() {
  return (
    <footer
      className={[
        "border-t border-slate-800",
        "bg-[#070A0F] text-slate-500",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto grid max-w-7xl gap-10",
          "px-6 py-12 md:grid-cols-2",
          "md:items-end",
        ].join(" ")}
      >
        <div>
          <p
            className={[
              "font-mono text-sm font-bold",
              "tracking-[0.2em] text-slate-300",
            ].join(" ")}
          >
            G-ARCHIVE NEXUS
          </p>

          <p
            className={[
              "mt-3 max-w-xl text-sm",
              "leading-6 text-slate-500",
            ].join(" ")}
          >
            A fan-made Mobile Suit intelligence
            database covering timelines, series,
            pilots, variants and technical records.
          </p>

          <p
            className={[
              "mt-5 font-mono text-[10px]",
              "uppercase tracking-wider",
              "text-slate-600",
            ].join(" ")}
          >
            Not affiliated with Bandai Namco,
            Sunrise or Sotsu
          </p>
        </div>

        <div className="md:text-right">
          <nav
            className={[
              "flex flex-wrap gap-5",
              "md:justify-end",
            ].join(" ")}
          >
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "font-mono text-xs uppercase",
                  "tracking-wider",
                  "hover:text-cyan-400",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={
              "https://github.com/" +
              "HaNguyenQuocTrung/" +
              "g-archive-nexus"
            }
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "mt-6 inline-flex items-center gap-2",
              "font-mono text-xs uppercase",
              "tracking-wider",
              "hover:text-cyan-400",
            ].join(" ")}
          >
            <Code2 size={15} />
            Source repository
          </a>
        </div>
      </div>

      <div className="border-t border-slate-900">
        <div
          className={[
            "mx-auto flex max-w-7xl",
            "flex-col gap-2 px-6 py-5",
            "font-mono text-[10px]",
            "uppercase tracking-wider",
            "sm:flex-row sm:justify-between",
          ].join(" ")}
        >
          <p>Archive terminal // GAN-01</p>
          <p>Created by Hạ Nguyễn Quốc Trung</p>
        </div>
      </div>
    </footer>
  );
}