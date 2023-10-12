import React, { useState } from "react";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import mixpanel from "mixpanel-browser";

import { ScatterplotLayer } from "@deck.gl/layers/typed";

import data from "../../public/final_properties_v1_2.json";
import { Modal } from "~/shadcn/components/Modal";

type DataPoint = {
  block: number;
  lot: number;
  lat: number;
  lon: number;
  propertyLocation: string;
  grantor: string;
  grantee: string;
};

type CleanedDataPoint = DataPoint & { prettyLocation: string };

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

const cleanedData = cleanData(data as DataPoint[]);

export default function DeckMap() {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [hoveredObject, setHoveredObject] = useState<DataPoint | null>(null);
  const [hovered, setHovered] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const ScatterPlayLayer = new ScatterplotLayer<DataPoint>({
    id: "scatterplot-layer",
    data: cleanedData,
    pickable: true,
    opacity: 0.8,
    filled: true,
    radiusScale: 10,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 0,
    getPosition: (d) => [d.lon, d.lat],
    getRadius: () => 1,
    getFillColor: (d, context) => {
      const value = d.block;
      if (selectedIndex !== undefined && context.index === selectedIndex) {
        return [255, 255, 204];
      }
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
    updateTriggers: {
      getFillColor: [selectedIndex],
    },
    // highlightedObjectIndex: selectedIndex,
    autoHighlight: true,
  });

  const layers = [ScatterPlayLayer];
  const metaData =
    selectedIndex !== undefined
      ? (data as DataPoint[])[selectedIndex]
      : undefined;

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        overflow: "hidden",
      }}
      getTooltip={({ object }: { object?: CleanedDataPoint | null }) => {
        return object
          ? {
              text: `Property Location: ${object.prettyLocation}
              Grantor: ${object.grantor}
              Grantee: ${object.grantee}`,
            }
          : null;
      }}
      controller={true}
      layers={layers}
      onClick={(data) => {
        console.log("click", data);

        if (!data) {
          setDrawerOpened(false);
          return;
        }

        const pointMetaData = data.object as DataPoint;
        mixpanel.track("click address", {
          "Property name": pointMetaData?.propertyLocation,
          Grantor: pointMetaData?.grantor,
          Grantee: pointMetaData?.grantee,
        });

        // console.log("does this click work");
        setSelectedIndex(data.index);
        setDrawerOpened(true);
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
      <Modal
        location={metaData?.propertyLocation}
        grantee={metaData?.grantee}
        grantor={metaData?.grantor}
        lat={metaData?.lat}
        lon={metaData?.lon}
        onOpenChange={(open) => {
          console.log("change", open);
          setSelectedIndex(undefined);
        }}
        isOpen={metaData !== undefined}
      />
    </DeckGL>
  );
}

function cleanData(data: DataPoint[]) {
  return data.map<CleanedDataPoint>((d) => {
    const first = d.propertyLocation.slice(0, 4);
    const middle = d.propertyLocation.slice(4, -4);
    const last = d.propertyLocation.slice(-4);

    const prettyLocation = [
      first.replace(/^0+/, ""),
      middle.trim().replace(/^0+/, ""),
      last.replace(/^0+/, ""),
    ].join(" ");

    return {
      ...d,
      prettyLocation,
    };
  });
}
