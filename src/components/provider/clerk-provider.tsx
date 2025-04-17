"use client";

import * as React from "react";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkAppProvider({
  children,
  ...props
}: React.ComponentProps<typeof ClerkProvider>) {
  return <ClerkProvider {...props}>{children}</ClerkProvider>;
}
