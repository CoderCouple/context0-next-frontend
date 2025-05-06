import { SignedIn, UserButton } from "@clerk/nextjs";

import BreadcrumHeader from "@/components/breadcrum-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex w-full items-center justify-between gap-2 px-4">
              <div className="flex items-center justify-center">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <BreadcrumHeader />
              </div>
              <div className="flex items-center gap-4">
                <ModeToggle />
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </header>
          <Separator />
          <div className="overflow-auto">
            <div className="PY-4 container flex-1 text-accent-foreground">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default layout;
