import React, { useMemo, useState } from "react";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import mixpanel from "mixpanel-browser";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import data from "../../public/final_properties_v1_2.json";
import { Modal } from "~/shadcn/components/Modal";
import { Input } from "~/components/ui/input";
import PostCovetLogo from "/public/Post-Covet_LOGO_SVG.svg";
import Image from "next/image";
import { useMapStore } from "~/store/store";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useDebounce } from "~/lib/hooks";
import { Button } from "./ui/button";
import { Moon, Map as LucideMap } from "lucide-react";

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
  const [searchValue, setSearchValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [hoveredObject, setHoveredObject] = useState<DataPoint | null>(null);
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const debouncedSearchValue = useDebounce(searchValue, 250);

  const addressCounter = useMapStore((state) => state.addressCounter);
  const increaseAddressCounter = useMapStore(
    (state) => state.increaseAddressCounter,
  );
  const remainingClickMessage =
    addressCounter >= 5
      ? "Sign in, old sport"
      : `${5 - addressCounter} clicks left`;

  const data = useMemo(() => {
    const searchTokens = debouncedSearchValue.toLowerCase().split(" ");
    const filteredData = cleanedData.filter((entry) => {
      return searchTokens.every(
        (token) =>
          entry.grantee.toLowerCase().includes(token) ||
          entry.grantor.toLowerCase().includes(token) ||
          entry.prettyLocation.includes(token),
      );
    });
    return filteredData;
  }, [debouncedSearchValue]);

  const ScatterPlayLayer = new ScatterplotLayer<DataPoint>({
    id: "scatterplot-layer",
    data: data,
    pickable: true,
    opacity: 0.8,
    filled: true,
    radiusScale:
      data.length > 100000
        ? 5
        : data.length > 10000
        ? 10
        : data.length > 100
        ? 20
        : 50,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 0,
    getPosition: (d) => [d.lon, d.lat],
    getRadius: (d, context) => {
      if (selectedIndex !== undefined && context.index === selectedIndex) {
        return 100;
      }
      return 1;
    },
    getFillColor: (d, context) => {
      if (selectedIndex !== undefined && context.index === selectedIndex) {
        // return [255, 255, 204]; // yelllow on select
        // return [170, 29, 1]; // red on select
        return [255, 108, 34]; // orange on select
      }

      // return [202, 179, 229]; // light purple default
      // return [255, 108, 34]; // orange default
      return [0, 0, 0]; // black default
    },
    // getFillColor: (d, context) => {
    //   const value = d.block;
    //   if (selectedIndex !== undefined && context.index === selectedIndex) {
    //     return [255, 255, 204];
    //   }
    //   if (value <= 1184) {
    //     if (hoveredObject && hoveredObject === d) {
    //       return [100, 24, 70];
    //     }
    //     return [90, 24, 70];
    //   } else if (value > 1184 && value <= 2116) {
    //     if (hoveredObject && hoveredObject === d) {
    //       return [115, 24, 70];
    //     }
    //     return [114, 12, 63];
    //   } else if (value > 2116 && value <= 3156) {
    //     if (hoveredObject && hoveredObject === d) {
    //       return [205, 1, 56];
    //     }
    //     return [199, 1, 56];
    //   } else if (value > 3156 && value <= 4283) {
    //     if (hoveredObject && hoveredObject === d) {
    //       return [232, 97, 27];
    //     }
    //     return [227, 97, 27];
    //   } else if (value > 4283 && value <= 6438) {
    //     if (hoveredObject && hoveredObject === d) {
    //       return [246, 146, 14];
    //     }
    //     return [241, 146, 14];
    //   }

    //   return [225, 195, 2];
    // },
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

  const darkMapStyle = "mapbox://styles/mapbox/dark-v11";
  const satelliteMapStyle = "mapbox://styles/mapbox/satellite-v9";

  const [isSatelliteMapStyle, setIsSatelliteMapStyle] = useState(true);

  return (
    <>
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
          if (!data.layer) {
            setSelectedIndex(-1);
            return;
          }

          if (data.index === -1) return;

          if (addressCounter > 4 && !isSignedIn) {
            void router.replace("/sign-in");
            return;
          } else {
            increaseAddressCounter(1);
          }

          const pointMetaData = data.object as DataPoint;
          mixpanel.track("click address", {
            "Property name": pointMetaData?.propertyLocation,
            Grantor: pointMetaData?.grantor,
            Grantee: pointMetaData?.grantee,
          });
          setSelectedIndex(data.index);
          return;
        }}
      >
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14,
          }}
          mapStyle={isSatelliteMapStyle ? satelliteMapStyle : darkMapStyle}
        />
        <Modal
          location={metaData?.propertyLocation}
          grantee={metaData?.grantee}
          grantor={metaData?.grantor}
          lat={metaData?.lat}
          lon={metaData?.lon}
          onOpenChange={(open) => {
            setSelectedIndex(undefined);
          }}
          isOpen={metaData !== undefined}
        />
      </DeckGL>
      <div className="absolute z-0 flex w-full flex-col gap-x-8 gap-y-2 p-4 md:flex-row md:p-8">
        <Image src={PostCovetLogo as string} alt="postcovet" />

        <div className="flex flex-col md:flex-row">
          <Input
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setSelectedIndex(undefined);
            }}
            placeholder="Search by name"
          />
          <div className="left-full top-0 flex h-full justify-between whitespace-nowrap pt-2 text-white md:items-center md:justify-center md:p-2">
            <span>({data.length} results)</span>
            <span className="sm:hidden" suppressHydrationWarning>
              {isSignedIn ? null : remainingClickMessage}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-0 w-full p-4">
        <Button
          variant="secondary"
          onClick={() => {
            setIsSatelliteMapStyle(!isSatelliteMapStyle);
            mixpanel.track("click map style", {
              isSatelliteMapStyle: isSatelliteMapStyle,
            });
          }}
        >
          {isSatelliteMapStyle ? (
            <Moon className="h-4 w-4" />
          ) : (
            <LucideMap className="h-4 w-4" />
          )}
        </Button>
      </div>
    </>
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
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    return {
      ...d,
      prettyLocation,
    };
  });
}
