import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ClerkProvider {...pageProps}>
      <SignedIn>
        <Component {...pageProps} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl={"/"} afterSignInUrl={"/"} />
      </SignedOut>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
