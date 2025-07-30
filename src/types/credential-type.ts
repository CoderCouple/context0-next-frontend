import { z } from "zod";

export interface CreateCredentialResponse {
  result: Credential;
  statusCode: number;
  message: string;
  success: boolean;
}

export interface CreateCredentialRequest {
  userId: string;
  name: string;
  value: string; // encrypted value
}

export interface DeleteCredentialRequest {
  name: string;
  userId: string;
  isSoftDelete?: boolean;
}

export interface DeleteCredentialResponse {
  result: {
    name: string;
    id: string;
  };
  statusCode: number;
  message: string;
  success: boolean;
}

export interface Credential {
  id: string;
  userId: string;
  name: string;
  value: string; // usually masked
  createdAt: string;
  updatedAt: string;
}

export interface GetCredentialsResponse {
  result: {
    credentials: Credential[];
  };
  statusCode: number;
  message: string;
  success: boolean;
}

export const EditUserProfileSchema = z.object({
  email: z.string().email("Required"),
  name: z.string().min(1, "Required"),
});

export const WorkflowFormSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

export type ConnectionTypes = "Google Drive" | "Notion" | "Slack" | "Discord";

export type Connection = {
  title: ConnectionTypes;
  description: string;
  image: string;
  connectionKey: keyof ConnectionProviderProps;
  accessTokenKey?: string;
  alwaysTrue?: boolean;
  slackSpecial?: boolean;
};

export type ConnectionProviderProps = {
  discordNode: {
    webhookURL: "";
    content: "";
    webhookName: "";
    guildName: "";
  };
  googleNode: [];
  notionNode: {
    accessToken: "";
    databaseId: "";
    workspaceName: "";
    content: "";
  };
  workflowTemplate: {
    discord: "";
    notion: "";
    slack: "";
  };
  slackNode: {
    appId: "";
    authedUserId: "";
    authedUserToken: "";
    slackAccessToken: "";
    botUserId: "";
    teamId: "";
    teamName: "";
    content: "";
  };
  isLoading: false;
  setGoogleNode: () => undefined;
  setDiscordNode: () => undefined;
  setNotionNode: () => undefined;
  setSlackNode: () => undefined;
  setIsLoading: () => undefined;
  setWorkFlowTemplate: () => undefined;
};
