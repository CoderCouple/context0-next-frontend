"use server";

import { auth } from "@clerk/nextjs/server";

import { getCredentialsApi } from "@/api/credential-api";
import { Credential } from "@/types/credential-type";

export async function GetCredentialsForUserAction(): Promise<Credential[]> {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("Unauthenticated");
  }

  const response = await getCredentialsApi(token, userId);

  // Now valid: response.result.credentials
  const credentials = response.result.credentials;

  if (!Array.isArray(credentials)) {
    console.warn("❌ Unexpected result.credentials shape:", credentials);
    return [];
  }

  return credentials;
}
