import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import mixpanel from "mixpanel-browser";

export default function UserAuth() {
  const { data: sessionData } = useSession();

  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={
        sessionData
          ? () => {
              mixpanel.track("Sign out");
              return void signOut();
            }
          : () => {
              mixpanel.track("Sign In");
              return void signIn();
            }
      }
    >
      {sessionData ? "Sign out" : "Sign in"}
    </button>
  );
}
