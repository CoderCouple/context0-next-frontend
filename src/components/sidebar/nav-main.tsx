"use client";

import {
  Collapsible
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    isBeta?: boolean
    items?: {
      title: string
      url: string
      isBeta?: boolean
    }[]
  }[]
}) {
  const pathname = usePathname();
  const activeRoute =
    items.find(
      (item) => item.url.length > 0 && pathname.includes(item.url)
    ) || items[0];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                {item.isBeta ? (
                  <div
                    className={buttonVariants({
                      variant: "sidebarItem",
                      className: "cursor-not-allowed opacity-60",
                    })}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </div>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Beta
                      </span>
                    </div>
                  </div>
                ) : (
                  <a
                    key={item.url}
                    href={item.url}
                    className={buttonVariants({
                      variant:
                        item.url === activeRoute.url
                          ? "activeSidebarItem"
                          : "sidebarItem",
                    })}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </div>
                    </div>
                  </a>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}