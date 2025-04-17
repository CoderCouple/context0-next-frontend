"use client";

import React from "react";

import { SignedIn, UserButton } from "@clerk/nextjs";

import BreadcrumHeader from "@/components/breadcrum-header";
import DesktopSidebar from "@/components/desktop-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Separator } from "@/components/ui/separator";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <MobileSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-[50px] items-center justify-between px-5 py-10">
          <BreadcrumHeader />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="PY-4 container flex-1 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
