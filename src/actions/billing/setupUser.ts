"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { setupUserApi } from "@/api/billing-api";

export async function SetupUser() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("unauthenticated");
  }

  await setupUserApi(token);
  redirect("/");
}
