import Image from "next/image";
import { ImageOff } from "lucide-react";

import type { ArchiveImage as ArchiveImageData } from "@/types";

interface ArchiveImageProps {
  image?: ArchiveImageData;
  fallbackLabel?: string;
  priority?: boolean;
  className?: string;
}

export default function ArchiveImage({
  image,
  fallbackLabel = "Visual data pending",
  priority = false,
  className = "",
}: ArchiveImageProps) {
  if (!image) {
    return (
      <div
        className={[
          "flex h-full min-h-64",
          "items-center justify-center",
          "bg-[#070A0F]",
          className,
        ].join(" ")}
      >
        <div className="text-center">
          <ImageOff
            size={52}
            strokeWidth={0.8}
            className="mx-auto text-slate-700"
          />

          <p
            className={[
              "mt-5 font-mono text-[10px]",
              "uppercase tracking-[0.25em]",
              "text-slate-600",
            ].join(" ")}
          >
            {fallbackLabel}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "relative h-full min-h-64",
        "overflow-hidden bg-[#070A0F]",
        className,
      ].join(" ")}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={
          "(max-width: 768px) 100vw, " +
          "(max-width: 1200px) 50vw, 40vw"
        }
        className="object-contain p-5"
      />

      <div
        className={[
          "pointer-events-none absolute",
          "inset-x-0 bottom-0",
          "bg-gradient-to-t",
          "from-[#070A0F] to-transparent",
          "px-5 pb-4 pt-10",
        ].join(" ")}
      >
        <p
          className={[
            "font-mono text-[9px] uppercase",
            "tracking-wider text-slate-500",
          ].join(" ")}
        >
          {image.type.replaceAll("-", " ")}
        </p>
      </div>
    </div>
  );
}
