import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_DEV_MODE: z.string().min(1),
    NEXT_PUBLIC_PYTHON_BACKEND_HOST: z.string().optional(),
    NEXT_PUBLIC_DISCORD_REDIRECT: z.string().optional(),
    NEXT_PUBLIC_NOTION_AUTH_URL: z.string().optional(),
    NEXT_PUBLIC_SLACK_REDIRECT: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_DEV_MODE:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_DEV_MODE,
    NEXT_PUBLIC_PYTHON_BACKEND_HOST:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_PYTHON_BACKEND_HOST,
    NEXT_PUBLIC_DISCORD_REDIRECT:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_DISCORD_REDIRECT,
    NEXT_PUBLIC_NOTION_AUTH_URL:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_NOTION_AUTH_URL,
    NEXT_PUBLIC_SLACK_REDIRECT:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_SLACK_REDIRECT,
    NEXT_PUBLIC_APP_URL:
      // eslint-disable-next-line n/no-process-env
      process.env.NEXT_PUBLIC_APP_URL,
  },
});
