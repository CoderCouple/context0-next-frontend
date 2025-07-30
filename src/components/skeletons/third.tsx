"use client";

import { useState } from "react";

import { IconDots, IconPlus } from "@tabler/icons-react";

import { Switch } from "@/components/switch";

export const SkeletonThree = () => {
  return (
    <div className="group mx-auto mt-10 h-full w-full rounded-md bg-white shadow-2xl dark:bg-neutral-800 dark:shadow-white/40 sm:w-[80%]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[11] h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />

      <div className="flex h-full w-full flex-1 flex-col space-y-2">
        <div className="flex justify-between border-b p-4 pb-2 dark:border-neutral-700">
          <p className="dark:text-neutral-300 text-sm font-bold text-neutral-600">
            Add LLM
          </p>
          <p className="shadow-derek dark:text-neutral-300 flex flex-shrink-0 items-center space-x-1 rounded-md px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-700">
            <IconPlus className="dark:text-neutral-300 h-4 w-4 text-neutral-600" />{" "}
            <span>Add</span>
          </p>
        </div>
        <div className="flex flex-col space-y-4 p-4">
          <Row title="Groq LLM" updatedAt="23rd March" />
          <Row title="OpenAI GPT0" updatedAt="21st March" active />
          <Row title="Stable DIffusion" updatedAt="3rd May" />
          <Row title="Llama 2" updatedAt="1st April" active />
          <Row title="Claude 200k" updatedAt="2nd June" active />
        </div>
      </div>
    </div>
  );
};

export const Row = ({
  title,
  updatedAt,
  active = false,
}: {
  title: string;
  updatedAt: string;
  active?: boolean;
}) => {
  const [checked, setChecked] = useState(active);
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="dark:text-neutral-300 shadow-aceternity rounded-md px-1 py-0.5 text-xs text-neutral-600 dark:bg-neutral-700">
          {title}
        </p>
        <p className="dark:text-neutral-300 text-xs text-neutral-600">{updatedAt}</p>
      </div>
      <div className="flex items-center space-x-1">
        <Switch checked={checked} setChecked={setChecked} />
        <IconDots className="dark:text-neutral-300 h-4 w-4 text-neutral-600" />
      </div>
    </div>
  );
};
