import React from "react";
import dynamic from "next/dynamic";

const TilingMap = dynamic(() => import("~/components/Google3dTiling"), {
  ssr: false,
});

export default function tiling3d() {
  return <TilingMap />;
}
