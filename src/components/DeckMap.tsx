import React, { useState } from "react";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import mixpanel from "mixpanel-browser";

import { ScatterplotLayer } from "@deck.gl/layers/typed";

import data from "../../public/final_properties_v1_1.json";
import { Modal } from "~/shadcn/components/Modal";

type DataPoint = {
  block: number;
  lot: number;
  lat: number;
  lon: number;
  property_Location: string;
  grantor: string;
  grantee: string;
};

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

export default function DeckMap() {
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
        if (hoveredObject && hoveredObject === d) {
          return [100, 24, 70];
        }
        return [90, 24, 70];
      } else if (value > 1184 && value <= 2116) {
        if (hoveredObject && hoveredObject === d) {
          return [115, 24, 70];
        }
        return [114, 12, 63];
      } else if (value > 2116 && value <= 3156) {
        if (hoveredObject && hoveredObject === d) {
          return [205, 1, 56];
        }
        return [199, 1, 56];
      } else if (value > 3156 && value <= 4283) {
        if (hoveredObject && hoveredObject === d) {
          return [232, 97, 27];
        }
        return [227, 97, 27];
      } else if (value > 4283 && value <= 6438) {
        if (hoveredObject && hoveredObject === d) {
          return [246, 146, 14];
        }
        return [241, 146, 14];
      }

      return [225, 195, 2];
    },
    // onHover: (d) => {
    //   console.log(d.color);
    // },
    onHover: ({ object }: { object?: DataPoint | null }) => {
      //@ts-ignore remove any
      setHoveredObject(object);
      console.log("is it hovered?");
      console.log(hoveredObject);
      setHovered(true);
    },
    onClick: (d) => {
      console.log(d.color);
      // d.color = "#aaaaaak";
    },
    autoHighlight: true,
  });

  const layers = [ScatterPlayLayer];
  const [metaData, setMetaData] = useState<DataPoint | undefined>();
  const [hoveredObject, setHoveredObject] = useState<DataPoint | null>(null);
  const [hovered, setHovered] = useState(false);

  const clearMetaData = () => {
    setMetaData(undefined);
  };

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        overflow: "hidden",
      }}
      getTooltip={({ object }: { object?: DataPoint | null }) => {
        return {
          text: object
            ? `Property Location: ${object.property_Location}
              Grantor: ${object.grantor}
              Grantee: ${object.grantee}`
            : "",
        };
      }}
      controller={true}
      layers={layers}
      onClick={(data) => {
        if (!data) {
          return;
        }

        const pointMetaData = data.object as DataPoint;
        mixpanel.track("click address", {
          "Property name": pointMetaData?.property_Location,
          Grantor: pointMetaData?.grantor,
          Grantee: pointMetaData?.grantee,
        });
        setMetaData(pointMetaData);
      }}
      // need to play with transition easing
      // viewState={
      //   metaData && {
      //     latitude: metaData?.lat,
      //     longitude: metaData?.lon,
      //     zoom: 16,
      //     pitch: 0,
      //     bearing: 0,
      //   }
      // }
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
      {metaData && (
        <Modal
          location={metaData?.property_Location}
          grantee={metaData?.grantee}
          grantor={metaData?.grantor}
          lat={metaData?.lat}
          lon={metaData?.lon}
          close={clearMetaData}
        />
      )}
    </DeckGL>
  );
}
