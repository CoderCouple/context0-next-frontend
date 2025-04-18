"use client";

import { useState } from "react";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { Link } from "next-view-transitions";
import { IoIosClose, IoIosMenu } from "react-icons/io";

import Logo from "@/components/logo";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { cn } from "@/lib/utils";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export const MobileNavbar = ({ navItems }: any) => {
  const [open, setOpen] = useState(false);

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
        "flex w-full items-center justify-between rounded-full bg-white px-2.5 py-1.5 transition duration-200 dark:bg-neutral-900",
        showBackground &&
          "bg-neutral-50 shadow-[0px_-2px_0px_0px_var(--neutral-100),0px_2px_0px_0px_var(--neutral-100)] dark:bg-neutral-900 dark:shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]"
      )}
    >
      <Logo />
      <IoIosMenu
        className="h-6 w-6 text-black dark:text-white"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col items-start justify-start space-y-10 bg-white pt-5 text-xl text-zinc-600 transition duration-200 hover:text-zinc-800 dark:bg-black">
          <div className="flex w-full items-center justify-between px-5">
            <Logo />
            <div className="flex items-center space-x-2">
              <ModeToggle />
              <IoIosClose
                className="h-8 w-8 text-black dark:text-white"
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[14px] px-8">
            {navItems.map((navItem: any, idx: number) => (
              <>
                {navItem.children && navItem.children.length > 0 ? (
                  <>
                    {navItem.children.map((childNavItem: any, idx: number) => (
                      <Link
                        key={`link=${idx}`}
                        href={childNavItem.link}
                        onClick={() => setOpen(false)}
                        className="relative max-w-[15rem] text-left md:text-2xl sm:text-sm"
                      >
                        <span className="block text-black">
                          {childNavItem.title}
                        </span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    key={`link=${idx}`}
                    href={navItem.link}
                    onClick={() => setOpen(false)}
                    className="relative"
                  >
                    <span className="block text-sm md:text-2xl text-black dark:text-white">
                      {navItem.title}
                    </span>
                  </Link>
                )}
              </>
            ))}
          </div>
          <div className="flex w-full flex-row items-start gap-2.5 px-8 py-4">
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
      )}
    </div>
  );
};
