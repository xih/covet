"use client";

import React from "react";
import { Map } from "react-map-gl";
import { env } from "~/env.mjs";
import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer, LineLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import "mapbox-gl/dist/mapbox-gl.css";

type Station = {
  inbound: number;
  outbound: number;
  from: {
    name: string;
    coordinates: [number, number];
  };
  to: {
    name: string;
    coordinates: [number, number];
  };
};

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781],
  },
];

export default function TilingMap() {
  const layer = new LineLayer({
    id: "LineLayer",
    data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json",

    /* props from LineLayer class */

    getColor: (d: Station) => [Math.sqrt(d.inbound + d.outbound), 140, 0],
    getSourcePosition: (d: Station) => d.from.coordinates,
    getTargetPosition: (d: Station) => d.to.coordinates,
    getWidth: 12,
    // widthMaxPixels: Number.MAX_SAFE_INTEGER,
    // widthMinPixels: 0,
    // widthScale: 1,
    // widthUnits: 'pixels',

    /* props inherited from Layer class */
    autoHighlight: true,
    // coordinateOrigin: [0, 0, 0],
    // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    highlightColor: [0, 0, 128, 128],
    // modelMatrix: null,
    // opacity: 1,
    pickable: true,
    // visible: true,
    // wrapLongitude: false,
  });

  const layers = [layer];
  // const layer = new TileLayer({
  //   // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
  //   data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",

  //   minZoom: 0,
  //   maxZoom: 19,
  //   tileSize: 256,

  //   renderSubLayers: (props) => {
  //     const {
  //       bbox: { west, south, east, north },
  //     } = props.tile;

  //     return new BitmapLayer(props, {
  //       data: null,
  //       image: props.data,
  //       bounds: [west, south, east, north],
  //     });
  //   },
  // });

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          overflow: "hidden",
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      />
    </DeckGL>
  );
}
