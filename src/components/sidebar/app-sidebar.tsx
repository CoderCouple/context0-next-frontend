"use client";

import * as React from "react";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";
import { ArrowUpCircleIcon, BrainIcon, CameraIcon, ClipboardListIcon, CoinsIcon, DatabaseIcon, FileCodeIcon, FileIcon, FileTextIcon, HelpCircleIcon, LayoutDashboardIcon, SearchIcon, ServerIcon, SettingsIcon, ShieldCheckIcon, Workflow, Rocket, Gamepad2, Network } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Onboarding",
      url: "onboarding",
      icon: Rocket,
      isBeta: false,
    },
    {
      title: "Playground",
      url: "playground",
      icon: Gamepad2,
      isBeta: false,
    },
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboardIcon,
      isBeta: false,
    },
    {
      title: "Memory",
      url: "memory",
      icon: BrainIcon,
      isBeta: false,
    },
    {
      title: "Graph",
      url: "graph",
      icon: Network,
      isBeta: false,
    },
    {
      title: "Credential",
      url: "credential",
      icon: ShieldCheckIcon,
       isBeta: false,
    },
    {
      title: "Billing",
      url: "billing",
      icon: CoinsIcon,
      isBeta: false,
    },
    {
      title: "Workflow",
      url: "workflow",
      icon: Workflow,
      isBeta: false,
    },
     {
      title: "MCP",
      url: "mcp",
      icon: ServerIcon,
      isBeta: false,
    }
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Context Zero AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />   
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}