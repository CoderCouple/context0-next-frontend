import { auth } from "@clerk/nextjs/server";
import { createServerActionProcedure } from "zsa";

import { rateLimitByKey } from "./limiter";

export const authenticatedAction = createServerActionProcedure().handler(
  async () => {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    await rateLimitByKey({
      key: `${userId}-global`,
      limit: 10,
      window: 10000,
    });
    return { userId };
  }
);

export const unauthenticatedAction = createServerActionProcedure().handler(
  async () => {
    await rateLimitByKey({
      key: "unauthenticated-global",
      limit: 10,
      window: 10000,
    });
  }
);
