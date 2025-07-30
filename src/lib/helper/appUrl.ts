import { env } from "@/env/client";

export function getAppUrl(path: string) {
  const appUrl = env.NEXT_PUBLIC_APP_URL || "";
  return `${appUrl}/${path}`;
}
