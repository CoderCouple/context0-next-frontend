"use client";

import React from "react";

import { ClerkAppProvider } from "./clerk-provider";

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
      {children}
    </ClerkAppProvider>
  );
}

export default AppProvider;
