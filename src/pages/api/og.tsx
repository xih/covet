import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

// Trying this from
// https://www.richardjzhang.com/posts/og-image-generation-in-nextjs
// but it's currently not working

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        Hello world!
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
