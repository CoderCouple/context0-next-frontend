import { ShieldIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import CreateCredentialDialog from "./_components/create-credential-dialog";
import UserCredentials from "./_components/user-credentials";

export default function CredentialsPage() {
  return (
    <div className="m-6 flex h-full flex-1 flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>

      <div className="h-full space-y-8 py-6">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring your data remains
            safe
          </AlertDescription>
        </Alert>

        <div className="h-full py-6">
          <UserCredentials />
        </div>
      </div>
    </div>
  );
}
