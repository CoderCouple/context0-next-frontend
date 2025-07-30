import React from "react";

import Logo from "@/components/logo";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Separator } from "@/components/ui/separator";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen w-full flex-col">
        {children}
        <Separator />
        <footer className="flex items-center justify-between p-2">
          <Logo iconSize={16} fontSize="text-xl" />
          <ModeToggle />
        </footer>
      </div>
    </>
  );
}

export default layout;
