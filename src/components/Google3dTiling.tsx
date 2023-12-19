import React, { useState } from "react";
import { Map } from "react-map-gl";
import { env } from "~/env.mjs";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { Tile3DLayer } from "@deck.gl/geo-layers/typed";
import {
  DataFilterExtension,
  _TerrainExtension as TerrainExtension,
} from "@deck.gl/extensions/typed";
import { scaleLinear } from "d3-scale";

const NEXT_PUBLIC_GOOGLE_3D_API = env.NEXT_PUBLIC_GOOGLE_3D_API; // eslint-disable-line
const TILESET_URL = "https://tile.googleapis.com/v1/3dtiles/root.json";

const INITIAL_VIEW_STATE = {
  latitude: 50.089,
  longitude: 14.42,
  zoom: 16,
  // minZoom: 14,
  // maxZoom: 16.5,
  bearing: 90,
  pitch: 60,
};

export const COLORS = [
  [254, 235, 226],
  [251, 180, 185],
  [247, 104, 161],
  [197, 27, 138],
  [122, 1, 119],
];

const colorScale = scaleLinear()
  .clamp(true)
  .domain([0, 50, 100, 200, 300])
  // @ts-ignore its ok
  .range(COLORS);

export default function Google3dTiling() {
  const [credits, setCredits] = useState("");

  const layers = [
    new Tile3DLayer({
      id: "google-3d-tiles",
      data: TILESET_URL,
      onTilesetLoad: (tileset3d) => {
        tileset3d.options.onTraversalComplete = (selectedTiles) => {
          const uniqueCredits = new Set();
          // selectedTiles.forEach((tile) => {
          //   const { copyright } = tile.content.gltf.asset;
          //   copyright.split(";").forEach(uniqueCredits.add, uniqueCredits);
          // });
          setCredits([...uniqueCredits].join("; "));
          return selectedTiles;
        };
      },
      loadOptions: {
        fetch: { headers: { "X-GOOG-API-KEY": NEXT_PUBLIC_GOOGLE_3D_API } },
      },
      operation: "terrain+draw",
    }),
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        overflow: "hidden",
      }}
      controller={{ touchRotate: true, inertia: 250 }}
      layers={layers}
    >
      <Map
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
      />
    </DeckGL>
  );
}
