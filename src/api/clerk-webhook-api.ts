import { AppError } from "@/lib/errors";
import {
  UpsertUserRequest,
  UpsertUserResponse,
} from "@/types/clerk-webhook-type";

import axiosClient from "./axios";

export async function upsertUserApi(
  req: UpsertUserRequest,
  token: string
): Promise<UpsertUserResponse> {
  try {
    const response = await axiosClient.post<
      UpsertUserRequest,
      UpsertUserResponse
    >("/user", req, {
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
        `User API error: ${err.response.data?.message || err.message}`,
        "USER_API_ERROR"
      );
    }
  }

  return {
    result: {
      clerkId: "",
      email: "",
      name: "",
      profileImage: "",
    },
    statusCode: 500,
    message: "User upsert failed",
    success: false,
  };
}
