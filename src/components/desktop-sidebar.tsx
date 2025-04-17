"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
} from "lucide-react";

import Logo from "./logo";
import { buttonVariants } from "./ui/button";

function DesktopSidebar() {
  const routes = [
    {
      href: "home",
      label: "Home",
      icon: HomeIcon,
    },
    {
      href: "workflow",
      label: "Workflow",
      icon: Layers2Icon,
    },
    {
      href: "credential",
      label: "Credential",
      icon: ShieldCheckIcon,
    },
    {
      href: "billing",
      label: "Billing",
      icon: CoinsIcon,
    },
  ];

  // Active Link
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  //console.log(activeRoute);
  return (
    //  DesktopSidebar
    <div className="relative hidden h-screen w-full min-w-[280px] max-w-[280px] border-separate overflow-hidden border-r-2 bg-primary/5 text-muted-foreground dark:bg-secondary/30 dark:text-foreground md:block">
      {/* Logo */}
      <div className="flex border-separate items-center justify-center gap-2 border-b-[1px] p-4">
        <Logo />
      </div>
      {/* Credits */}
      <div className="p-2">TODO : Credits</div>
      {/* Nav Links */}
      <div className="flex flex-col gap-2 p-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={buttonVariants({
                variant:
                  route.href === activeRoute.href
                    ? "activeSidebarItem"
                    : "sidebarItem",
              })}
            >
              <Icon size={20}></Icon>
              {route.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default DesktopSidebar;
