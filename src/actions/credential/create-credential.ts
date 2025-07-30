"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { createCredentialApi } from "@/api/credential-api";
import { symmetricEncrypt } from "@/lib/encription/encryption";
import {
  CreateCredentialSchema,
  CreateCredentialSchemaType,
} from "@/schema/credential";
import { ActionResponse } from "@/types";
import { Credential } from "@/types/credential-type";

export async function CreateCredentialAction(
  form: CreateCredentialSchemaType
): Promise<ActionResponse<Credential>> {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return {
      success: false,
      message: "Unauthenticated",
    };
  }

  const { success, data, error } = CreateCredentialSchema.safeParse(form);
  if (!success) {
    return {
      success: false,
      message: error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const encryptedValue = symmetricEncrypt(data.value);
    const response = await createCredentialApi(
      {
        userId,
        name: data.name,
        value: encryptedValue,
      },
      token
    );

    revalidatePath("/credential");

    return {
      success: true,
      data: response?.result as Credential,
    };
  } catch (err: any) {
    console.error("[CREATE CREDENTIAL ERROR]", err);
    revalidatePath("/credential");
    return {
      success: false,
      message: err.customMessage || "Unexpected error",
    };
  }
}
