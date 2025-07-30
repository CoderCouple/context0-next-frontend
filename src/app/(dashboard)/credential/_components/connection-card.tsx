import Image from "next/image";
import Link from "next/link";

import { Plug2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectionTypes } from "@/types/credential-type";
import { env } from "@/env/client";

type Props = {
  type: ConnectionTypes;
  icon: string;
  title: ConnectionTypes;
  description: string;
  callback?: () => void;
  connected: {} & any;
};

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
}: Props) => {
  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row justify-between gap-2">
          <Image
            src={icon}
            alt={title}
            height={30}
            width={30}
            className="object-contain"
          />
          <div className="flex items-center gap-2">
            {connected[type] ? (
              <div className="border-bg-primary rounded-lg border-2 px-3 py-2 font-bold text-white">
                Connected
              </div>
            ) : (
              <Button
                asChild
                variant="outline"
                className="group flex items-center space-x-2"
              >
                <Link href={getRedirectUrl(title)} className="rounded-lg">
                  <Plug2 className="h-5 w-5 stroke-[2px] text-neutral-800 transition-transform duration-200 group-hover:translate-x-1 dark:text-neutral-200" />
                  Connect
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

const getRedirectUrl = (title: ConnectionTypes): string => {
  switch (title) {
    case "Discord":
      return env.NEXT_PUBLIC_DISCORD_REDIRECT || "/error/discord-missing";
    case "Notion":
      return env.NEXT_PUBLIC_NOTION_AUTH_URL || "/error/notion-missing";
    case "Slack":
      return env.NEXT_PUBLIC_SLACK_REDIRECT || "/error/slack-missing";
    default:
      return "#";
  }
};
export default ConnectionCard;
