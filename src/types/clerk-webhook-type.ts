export interface UpsertUserRequest {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    image_url?: string;
  };
}

export interface UpsertUserResponse {
  result: {
    clerkId: string;
    email: string;
    name: string;
    profileImage?: string;
  };
  statusCode: number;
  message: string;
  success: boolean;
}
