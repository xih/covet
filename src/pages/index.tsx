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

const DeckMap = dynamic(() => import("~/components/DeckMap"), {
  ssr: false,
});

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // console.log(data, "data");

  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });

  return (
    <>
      <Head>
        <title>Covet - find who owns the property in San Francisco</title>
        <meta name="description" content="who owns these homes here?" />
        <link rel="icon" href="/covet-favicon.ico" />
      </Head>
      <main className="">
        <DeckMap />
        <div className="absolute bottom-8 right-8">
          <AlertDialogDemo />
        </div>
        <div className="absolute right-8 top-8">
          <UserAuth />
        </div>
        {/* <KeplerMap /> */}
      </main>
    </>
  );
}
