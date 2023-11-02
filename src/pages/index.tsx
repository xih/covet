import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
import KeplerMap from "~/components/KeplerMap";
import mixpanel from "mixpanel-browser";
import { AlertDialogDemo } from "~/shadcn/components/AlertDialogDemo";
import { Button } from "~/components/ui/button";
import UserAuth from "~/components/ui/UserAuth";
import { useMapStore } from "~/store/store";
import { useEffect, useState } from "react";
import { UserButton, SignInButton, useUser, useSignIn } from "@clerk/nextjs";
import { env } from "process";

const LoadingView = () => {
  return (
    <div className="bg-black">
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-red-500"></div>
      </div>
    </div>
  );
};

const DeckMap = dynamic(() => import("~/components/DeckMap"), {
  ssr: false,
  loading: () => <LoadingView />,
});

export default function Home() {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
    debug: env.development ? true : false,
    // debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });

  const addressCounter = useMapStore((state) => state.addressCounter);
  const remainingClickMessage =
    addressCounter >= 5
      ? "Sign in, old sport"
      : `${5 - addressCounter} clicks left`;

  const { isSignedIn, user, isLoaded } = useUser();
  const { signIn } = useSignIn();

  useEffect(() => {
    if (user) {
      mixpanel.identify(user.id);
      mixpanel.register({
        Email: user.primaryEmailAddress?.emailAddress,
      });
      mixpanel.people.set({
        // Email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        createdAt: new Date().toISOString(),
      });
    }
  }, [signIn?.status, user]);

  return (
    <>
      <Head>
        <title>Covet - find who owns property in San Francisco</title>
        <meta name="description" content="who owns these homes here?" />
        <link rel="icon" href="/covet-favicon.ico" />
      </Head>
      <main className="">
        <DeckMap />
        <div className="absolute bottom-4 right-4">
          <AlertDialogDemo />
        </div>
        <div className="absolute right-0 flex flex-row-reverse p-4 md:p-8">
          {/* <UserAuth /> */}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex items-center">
              <span
                suppressHydrationWarning
                className="mr-4 hidden text-white sm:inline"
              >
                {remainingClickMessage}
              </span>
              <SignInButton mode="modal">
                <Button variant="outline" className="">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
