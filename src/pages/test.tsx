import Head from "next/head";
import React from "react";

export default function test() {
  const title = "PostCovet 33333";
  const description =
    "San Francisco Deed Search. Search and find deed data within seconds. Address Search. Individual Name";
  const url = "https://postcovet.com";
  const image = `${url}/postcovet.png`;

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
      </Head>
      <div>test</div>
    </div>
  );
}
