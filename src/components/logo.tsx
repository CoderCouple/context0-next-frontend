"use client";

import Link from "next/link";

import { Contrast } from "lucide-react";

import { cn } from "@/lib/utils";

function Logo({
  fontSize = "text-2xl",
  iconSize = 40,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  const deploy = "Context";
  const zero = "Zero";

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center gap-2 text-2xl font-extrabold",
        fontSize
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-2">
        <Contrast
          size={iconSize}
          //  style={{ transform: "scaleX(-1) rotate(90deg)" }}
          style={{ transform: "scaleX(-1)" }}
          className="stroke-white"
        />
      </div>
      <div>
        <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-2xl font-extrabold text-transparent">
          {deploy}
        </span>
        <span className="text-stone-700 dark:text-stone-300">{zero}</span>
      </div>
    </Link>
  );
}

export default Logo;
