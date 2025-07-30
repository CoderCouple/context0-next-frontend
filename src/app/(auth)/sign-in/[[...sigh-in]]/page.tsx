import React from "react";

import { SignIn } from "@clerk/nextjs";

function Page() {
  return (
    <SignIn 
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    />
  );
}

export default Page;
