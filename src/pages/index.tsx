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
import { Metadata } from "next";

const LoadingView = () => {
  return (
    <div className="bg-black">
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-red-500"></div>
      </div>
    </div>
  );
};

export const metadata: Metadata = {
  title: "Post Covet",
  description: "Find owners of single family homes in SF",
  generator: "Next.js",
  applicationName: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: ["deed search", "property records in San Francisco", "own homes"],
  authors: [{ name: "Seb" }, { name: "Josh", url: "https://nextjs.org" }],
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Next.js",
    description: "The React Framework for the Web",
    url: "https://nextjs.org",
    siteName: "Next.js",
    images: [
      {
        url: "https://nextjs.org/og.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://nextjs.org/og-alt.png",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const DeckMap = dynamic(() => import("~/components/DeckMap"), {
  // SRR has to be false because of this:
  // https://github.com/visgl/deck.gl/issues/7735#issuecomment-1464197310
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
      <main className="">
        {/* hypothesis: dynamically importing deckmap is causing the head tag to not work.
        approach: try using a react-map component (non-dynamically loaded and see if meta tags work)
        
        also try this: https://github.com/garmeeh/next-seo
         */}
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
