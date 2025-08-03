"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { deleteCredentialApi } from "@/api/credential-api";
import { ActionResponse } from "@/types";
import { Credential } from "@/types/credential-type";

export async function DeleteCredentialAction(
  name: string
): Promise<ActionResponse<Credential>> {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return {
      success: false,
      message: "Unauthenticated",
    };
  }

  try {
    const baseResponse = await deleteCredentialApi(token, {
      name,
      userId,
      isSoftDelete: false,
    });

    const credential = baseResponse.result;

    revalidatePath("/credentials");

    return {
      success: true,
      data: credential as Credential,
    };
  } catch (err: any) {
    console.error("[DELETE CREDENTIAL ERROR]", err);
    revalidatePath("/credentials");
    return {
      success: false,
      message: err.customMessage || "Unexpected error",
    };
  }
}
