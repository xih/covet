import dynamic from "next/dynamic";
import mixpanel from "mixpanel-browser";
import { AlertDialogDemo } from "~/shadcn/components/AlertDialogDemo";
import { Button } from "~/components/ui/button";
import { useMapStore } from "~/store/store";
import { useEffect, useState } from "react";
import { UserButton, SignInButton, useUser, useSignIn } from "@clerk/nextjs";
import OnboardingDrawer from "~/components/OnboardingBottomSheet";
import { useMediaQuery } from "~/lib/utils";
import HelpBottomSheet from "~/components/HelpBottomSheet";
import { env } from "~/env.mjs";
import {
  identifyUser,
  initMixpanel,
  registerUser,
  testMixpanel,
} from "services/mixpanel";
import "mapbox-gl/dist/mapbox-gl.css";

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
  initMixpanel();

  const { isSignedIn, user, isLoaded } = useUser();
  const { signIn } = useSignIn();

  const useIsMobile = () => useMediaQuery(800);
  const [openHelpBottomSheet, setHelpBottomSheetOpen] = useState(false);
  const { isFirstTimeVisit } = useMapStore();
  const [_, setOnboardingDrawerOpen] = useState(true);

  useEffect(() => {
    if (user) {
      identifyUser(user.id);
      const email = user.primaryEmailAddress?.emailAddress;
      const fullName = user.fullName;
      if (email && fullName) {
        registerUser(fullName, email);
      }
    }
  }, [user]);

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
