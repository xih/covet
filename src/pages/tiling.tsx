import React from "react";
import dynamic from "next/dynamic";
const TilingMap = dynamic(() => import("~/components/TilingMap"), {
  ssr: false,
});

export default function tiling() {
  return <TilingMap />;
}
