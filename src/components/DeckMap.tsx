import React from "react";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";

import {
  GeoJsonLayer,
  LineLayer,
  ScatterplotLayer,
} from "@deck.gl/layers/typed";

import data from "../../public/final_properties_v1.json";

type DataPoint = {
  block: number;
  lot: number;
  lat: number;
  lon: number;
  PropertyLocation: string;
  grantor: string;
  grantee: string;
};

export default function DeckMap() {
  // Viewport settings
  const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  };

  const layers = [
    new ScatterplotLayer<DataPoint>({
      id: "scatterplot-layer",
      data: data as DataPoint[],
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      // getPosition: (d) => d.coordinates,
      getPosition: (d) => [d.lon, d.lat],
      getRadius: (d) => 1,
      // getFillColor: (d) => [255, 140, 0],
      // getLineColor: (d) => [0, 0, 0],
    }),
  ];

  console.log(data);

  return (
    <div className="h-screen w-screen">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={({ object }: { object?: DataPoint | null }) => ({
          text: object ? `${object.PropertyLocation}\n${object.grantor}` : "",
        })}
      >
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14,
          }}
          mapStyle="mapbox://styles/mapbox/dark-v9"
        />
      </DeckGL>
    </div>
  );
}
