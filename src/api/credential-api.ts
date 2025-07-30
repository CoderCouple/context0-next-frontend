// define this interface
import { AppError } from "@/lib/errors";
import {
  CreateCredentialRequest,
  CreateCredentialResponse,
  DeleteCredentialRequest,
  DeleteCredentialResponse,
  GetCredentialsResponse,
} from "@/types/credential-type";

import axiosClient from "./axios";

export async function createCredentialApi(
  createCredentialRequest: CreateCredentialRequest,
  token: string
): Promise<CreateCredentialResponse> {
  try {
    const response = await axiosClient.post<
      CreateCredentialRequest,
      CreateCredentialResponse
    >("/credential", createCredentialRequest, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Credential API error: ${err.response.data?.message || err.message}`,
        "CREDENTIAL_API_ERROR"
      );
    }
  }

  return {
    result: {} as CreateCredentialResponse["result"],
    statusCode: 500,
    message: "Credential creation failed",
    success: false,
  };
}

export async function deleteCredentialApi(
  token: string,
  input: DeleteCredentialRequest
): Promise<DeleteCredentialResponse> {
  try {
    const response = await axiosClient.delete<
      unknown,
      DeleteCredentialResponse
    >("/credential", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      data: {
        name: input.name,
        user_id: input.userId,
        is_soft_delete: input.isSoftDelete ?? true,
      },
    });

    console.log("[AXIOS DELETE CREDENTIAL RESPONSE]:", response);
    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Credential API error: ${err.response.data?.message || err.message}`,
        "CREDENTIAL_API_ERROR"
      );
    }

    throw new AppError("Delete credential failed", "API_FAILED");
  }
}

export async function getCredentialsApi(
  token: string,
  userId: string
): Promise<GetCredentialsResponse> {
  try {
    const response = await axiosClient.get<unknown, GetCredentialsResponse>(
      "/credential",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { user_id: userId },
      }
    );

    //console.log("[AXIOS GET CREDENTIALS RESPONSE]:", response.result);
    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Credential API error: ${err.response.data?.message || err.message}`,
        "CREDENTIAL_API_ERROR"
      );
    }

    throw new AppError("Get credentials failed", "API_FAILED");
  }
}
