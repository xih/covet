import React from "react";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import mixpanel from "mixpanel-browser";

import { ScatterplotLayer } from "@deck.gl/layers/typed";

import data from "../../public/final_properties_v1_1.json";

type DataPoint = {
  block: number;
  lot: number;
  lat: number;
  lon: number;
  property_Location: string;
  grantor: string;
  grantee: string;
};

const ScatterPlayLayer = new ScatterplotLayer<DataPoint>({
  id: "scatterplot-layer",
  data: data as DataPoint[],
  pickable: true,
  opacity: 0.8,
  filled: true,
  radiusScale: 10,
  radiusMinPixels: 1,
  radiusMaxPixels: 100,
  lineWidthMinPixels: 0,
  getPosition: (d) => [d.lon, d.lat],
  getRadius: () => 1,
  getFillColor: (d) => {
    const value = d.block;
    if (value <= 1184) {
      return [90, 24, 70];
    } else if (value > 1184 && value <= 2116) {
      return [114, 12, 63];
    } else if (value > 2116 && value <= 3156) {
      return [199, 1, 56];
    } else if (value > 3156 && value <= 4283) {
      return [227, 97, 27];
    } else if (value > 4283 && value <= 6438) {
      return [241, 146, 14];
    }

    return [225, 195, 2];
  },
});

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

export default function DeckMap() {
  const layers = [ScatterPlayLayer];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      width={"100vw"}
      height={"100vh"}
      getTooltip={({ object }: { object?: DataPoint | null }) => {
        if (object) {
          mixpanel.track("click address", {
            "Property name": object.property_Location,
            Grantor: object.grantor,
            Grantee: object.grantee,
          });
        }
        return {
          text: object
            ? `Property Location: ${object.property_Location}
              Grantor: ${object.grantor}
              Grantee: ${object.grantee}`
            : "",
        };
      }}
    >
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        mapStyle={"mapbox://styles/mapbox/dark-v11"}
      />
    </DeckGL>
  );
}
