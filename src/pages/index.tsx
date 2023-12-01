import dynamic from "next/dynamic";
import mixpanel from "mixpanel-browser";
import { AlertDialogDemo } from "~/shadcn/components/AlertDialogDemo";
import { Button } from "~/components/ui/button";
import { useMapStore } from "~/store/store";
import { useEffect, useState } from "react";
import { UserButton, SignInButton, useUser, useSignIn } from "@clerk/nextjs";
import { env } from "process";
import OnboardingDrawer from "~/components/OnboardingBottomSheet";
import { useMediaQuery } from "~/lib/utils";
import HelpBottomSheet from "~/components/HelpBottomSheet";

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

  const { isSignedIn, user, isLoaded } = useUser();
  const { signIn } = useSignIn();

  const useIsMobile = () => useMediaQuery(800);
  const [openHelpBottomSheet, setHelpBottomSheetOpen] = useState(false);
  const { isFirstTimeVisit } = useMapStore();
  const [_, setOnboardingDrawerOpen] = useState(true);

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
        {useIsMobile() && isFirstTimeVisit ? (
          <OnboardingDrawer
            open={isFirstTimeVisit}
            setOpen={setOnboardingDrawerOpen}
          />
        ) : null}
        <DeckMap />
        <div className="fixed bottom-4 right-4">
          {/* Help button */}
          {useIsMobile() ? (
            <HelpBottomSheet
              open={openHelpBottomSheet}
              setOpen={setHelpBottomSheetOpen}
            />
          ) : (
            <AlertDialogDemo />
          )}
        </div>
        <div className="fixed right-0 flex flex-row-reverse p-4 md:p-8">
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
