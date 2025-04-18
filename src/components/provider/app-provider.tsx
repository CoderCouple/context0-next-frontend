"use client";

import React from "react";

import { ClerkAppProvider } from "./clerk-provider";
import { QueryProvider } from "./react-query-client-provider";
import { ThemeProvider } from "./theme-provider";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkAppProvider
      afterSignOutUrl={"/sign-in"}
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-sm !shadow-none",
        },
      }}
    >
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryProvider>
    </ClerkAppProvider>
  );
}

export default AppProvider;
