"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, LockKeyholeIcon, ShieldOffIcon } from "lucide-react";

import { GetCredentialsForUserAction } from "@/actions/credential/get-credentials-for-user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CONNECTIONS } from "@/lib/constant";
import { Credential } from "@/types/credential-type";

import ConnectionCard from "./connection-card";
import CreateCredentialDialog from "./create-credential-dialog";
import DeleteCredentialDialog from "./delete-credential-dialog";

export default function UserCredentials() {
  const {
    data: credentials,
    isLoading,
    isError,
  } = useQuery<Credential[]>({
    queryKey: ["get-credentials"],
    queryFn: GetCredentialsForUserAction,
  });

  if (isLoading) return <UserCredentialsSkeleton />;

  if (isError || !credentials) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading credentials</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative text-muted-foreground">
        <p className="leading-sm mb-4 text-primary">
          Connect all your apps directly from here. You may need to connect
          these apps regularly to refresh verification.
        </p>

        <div className="grid grid-cols-1 gap-4 text-muted-foreground sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CONNECTIONS.map((connection) => (
            <ConnectionCard
              key={connection.title}
              description={connection.description}
              title={connection.title}
              icon={connection.image}
              type={connection.title}
              connected={{}}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {credentials?.map((credential) => {
          const createdAt = formatDistanceToNow(
            new Date(credential.createdAt),
            {
              addSuffix: true,
            }
          );

          return (
            <Card
              key={credential.id}
              className="flex w-full justify-between p-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <LockKeyholeIcon size={18} className="stroke-primary" />
                </div>
                <div>
                  <p className="font-bold">{credential.name}</p>
                  <p className="text-xs text-muted-foreground">{createdAt}</p>
                </div>
              </div>
              <DeleteCredentialDialog name={credential.name} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function UserCredentialsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
