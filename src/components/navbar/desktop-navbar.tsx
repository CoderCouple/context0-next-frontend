"use client";

import { useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import Logo from "@/components/logo";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { cn } from "@/lib/utils";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { NavBarItem } from "./navbar-item";

type Props = {
  navItems: {
    link: string;
    title: string;
    target?: "_blank";
  }[];
};

export const DesktopNavbar = ({ navItems }: Props) => {
  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });
  return (
    <div
      className={cn(
        "relative z-10 flex w-full justify-between rounded-full px-4 py-2 transition duration-200",
    "text-black dark:text-white",
        showBackground &&
          "bg-neutral-50 shadow-[0px_-2px_0px_0px_var(--neutral-100),0px_2px_0px_0px_var(--neutral-100)] dark:bg-neutral-900 dark:shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]"
      )}
    >
      <AnimatePresence>
        {showBackground && (
         <motion.div
          key={String(showBackground)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-full bg-neutral-100 [mask-image:linear-gradient(to_bottom,white,transparent,white)] dark:bg-neutral-800"
        />
        )}
      </AnimatePresence>
      <div className="flex flex-row items-center gap-2">
        <Logo />
        <div className="flex items-center gap-1.5">
          {navItems.map((item) => (
            <NavBarItem href={item.link} key={item.title} target={item.target}>
              {item.title}
            </NavBarItem>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
  <ModeToggle />
  <SignInButton mode="modal">
     <button className={cn(
        "bg-gradient-to-r bg-primary/90 to-bg-primary/100  relative z-10 hover:bg-primary/10  text-white text-sm md:text-sm transition font-medium duration-200  rounded-full px-4 py-2  flex items-center justify-center","bg-gradient-to-r to-bg-primary/90 to-bg-primary/100 relative z-10 bg-transparent hover:bg-primary/10  border border-transparent text-black text-sm md:text-sm transition font-medium duration-200  rounded-full px-4 py-2  flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 dark:hover:shadow-xl"
      )}>Sign In</button>
  </SignInButton>
  <SignUpButton mode="modal">
    <button className={cn(
        "bg-gradient-to-r bg-primary/90 to-bg-primary/100  relative z-10 hover:bg-primary  text-white text-sm md:text-sm transition font-medium duration-200  rounded-full px-4 py-2  flex items-center justify-center","bg-gradient-to-r bg-primary/90 to-bg-primary/100 relative z-10 hover:bg-primary  border border-transparent text-white text-sm md:text-sm transition font-medium duration-200  rounded-full px-4 py-2  flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]"
      )}>Sign Up</button>
  </SignUpButton>
</div>
    </div>
  );
};
