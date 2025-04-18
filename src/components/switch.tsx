import { useId } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const Switch = ({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) => {
  const id = useId();
  return (
    <form className="flex items-center space-x-4 antialiased">
      <label
        htmlFor={id}
        className={cn(
          "relative flex h-4 w-[40px] cursor-pointer items-center rounded-full border border-transparent px-1 shadow-[inset_0px_0px_12px_rgba(0,0,0,0.25)] transition duration-200",
          checked ? "bg-blue-500" : "border-slate-500 bg-slate-700"
        )}
      >
        <motion.div
          initial={{
            width: "10px",
            x: checked ? -2 : 20,
          }}
          animate={{
            height: ["12px", "10px", "12px"],
            width: ["12px", "18px", "12px", "12px"],
            x: checked ? 20 : -2,
          }}
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
          key={String(checked)}
          className={cn("z-10 block h-[20px] rounded-full bg-white shadow-md")}
        ></motion.div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="hidden"
          id={id}
        />
      </label>
    </form>
  );
};
