import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const handle = (req: NextRequest) => {
  return NextResponse.json({ hello: true });
};

export default handle;

// import { ImageResponse } from "@vercel/og";

// export const config = {
//   runtime: "edge",
// };

// export default function handler() {
//   return new ImageResponse(
//     (
//       <div
//         style={{
//           fontSize: 40,
//           color: "black",
//           background: "white",
//           width: "100%",
//           height: "100%",
//           padding: "50px 200px",
//           textAlign: "center",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         👋 Hello 你好 नमस्ते こんにちは สวัสดีค่ะ 안녕 добрий день Hallá
//       </div>
//     ),
//     {
//       width: 1200,
//       height: 630,
//     },
//   );
// }

// import { ImageResponse } from "@vercel/og";
// import { NextRequest } from "next/server";

// export const config = {
//   runtime: "edge",
// };

// // Trying this from
// // https://www.richardjzhang.com/posts/og-image-generation-in-nextjs
// // but it's currently not working

// export default function handler() {
//   return new ImageResponse(
//     (
//       <div
//         style={{
//           fontSize: 128,
//           background: "white",
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           textAlign: "center",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 40,
//         }}
//       >
//         Hello world!
//       </div>
//     ),
//     {
//       width: 1200,
//       height: 630,
//     },
//   );
// }
