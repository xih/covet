import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";

import "~/styles/globals.css";
import Head from "next/head";
import type { Metadata } from "next";

const title = "PostCovet";
const description =
  "San Francisco Deed Search. Search and find deed data within seconds. Address Search. Individual Name";
const url = "https://postcovet.com";
const image = `${url}/postcovet.png`;

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#template
// either use the static metadata object from next or
// the dynamic metadata with generateMetaData({ params })
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: "Post Covet",
    description: "Find owners of single family homes in SF!",
    images: [
      {
        url: `${url}/postcovet.png`,
        width: 800,
        height: 600,
      },
      {
        url: `${url}/postcovet.png`,
        width: 1800,
        height: 1600,
        alt: "Post Covet Logo San Francisco",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <meta name="description" content={description} key="desc" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <title>{title}</title>
        <link rel="icon" href="/covet-favicon2.ico" />
      </Head>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
