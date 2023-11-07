import React, { useEffect, useMemo, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import mixpanel from "mixpanel-browser";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import data from "../../public/properties_v1_3.json";
import { Modal } from "~/shadcn/components/Modal";
import PostCovetLogo from "/public/Post-Covet_LOGO_SVG.svg";
import Image from "next/image";
import { useMapStore } from "~/store/store";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useDebounce } from "~/lib/hooks";
import { Button } from "./ui/button";
import { Moon, Map as LucideMap } from "lucide-react";
import { Badge } from "~/components/ui/badge";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";

type DataPoint = {
  block: number;
  lot: number;
  lat: number;
  lon: number;
  propertyLocation: string;
  grantor: string;
  grantee: string;
  prettyLocation: string;
  id: number;
};

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration: number;
};

const INITIAL_VIEW_STATE: ViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
  transitionDuration: 1000,
};

const cleanedData = data as DataPoint[];

export default function DeckMap() {
  const [searchValue, setSearchValue] = useState("");
  // const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<
    number | undefined | null
  >();
  const [hoveredObject, setHoveredObject] = useState<DataPoint | null>(null);
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 250);
  const analyticsSearchValue = useDebounce(searchValue, 1250);
  const darkMapStyle = "mapbox://styles/mapbox/dark-v11";
  const satelliteMapStyle = "mapbox://styles/mapbox/satellite-v9";

  const [isSatelliteMapStyle, setIsSatelliteMapStyle] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const addressCounter = useMapStore((state) => state.addressCounter);
  const increaseAddressCounter = useMapStore(
    (state) => state.increaseAddressCounter,
  );

  const selectedPointData = useMemo(() => {
    return typeof selectedIndex === "number"
      ? cleanedData[selectedIndex]
      : null;
  }, [selectedIndex]);

  const data = useMemo(() => {
    if (!debouncedSearchValue) {
      return cleanedData;
    }
    const searchTokens = debouncedSearchValue.toUpperCase().split(" ");
    const filteredData = cleanedData.filter((entry) => {
      return searchTokens.every(
        (token) =>
          entry.grantee.toUpperCase().includes(token) ||
          entry.grantor.toUpperCase().includes(token) ||
          entry.prettyLocation.includes(token),
      );
    });
    return filteredData;
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (analyticsSearchValue) {
      mixpanel.track("search", { query: analyticsSearchValue });
    }
  }, [analyticsSearchValue]);

  // useEffect(() => {
  //   setSelectedIndex(null);
  // }, [searchValue]);

  const blue700 = [29, 78, 216];
  const orange500 = [249, 115, 22];
  const rose300 = [253, 164, 175];
  const rose500 = [244, 63, 94];

  const slate300 = [203, 213, 225];

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
        return 1.2;
      }
      return 1;
    },
    // @ts-ignore ignore color
    getFillColor: (d, context) => {
      if (selectedIndex !== undefined && context.index === selectedIndex) {
        return isSatelliteMapStyle ? blue700 : orange500; // orange on select
      }

      return isSatelliteMapStyle ? rose300 : slate300; // light black
    },
    updateTriggers: {
      getFillColor: [selectedIndex, isSatelliteMapStyle],
      getRadius: [selectedIndex],
    },
    // highlightedObjectIndex: selectedIndex,
    autoHighlight: true,
    highlightColor: () => {
      return isSatelliteMapStyle ? [244, 63, 94] : [100, 116, 139];
    },
  });

  const layers = [ScatterPlayLayer];

  useEffect(() => {
    console.log("selected index changed: ", selectedIndex);
    if (typeof selectedIndex === "number" && selectedIndex > -1) {
      const point = cleanedData[selectedIndex];
      if (!point) {
        console.error("point not found");
        return;
      }
      console.log("updating view state");

      setViewState((prev) => {
        return {
          ...prev,
          latitude: point.lat,
          longitude: point.lon,
          zoom: 17,
          transitionDuration: 1000,
        };
      });
    }
  }, [selectedIndex, data]);

  return (
    <>
      <DeckGL
        initialViewState={viewState}
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          overflow: "hidden",
        }}
        getTooltip={({ object }: { object?: DataPoint | null }) => {
          return object
            ? {
                text: `Property Location: ${object.prettyLocation.toUpperCase()}
              Grantor: ${object.grantor}
              Grantee: ${object.grantee}`,
              }
            : null;
        }}
        controller={true}
        layers={layers}
        onClick={(data) => {
          setSuggestionsVisible(false);
          if (!data.layer) {
            setSelectedIndex(null);
            return;
          }

          if (data.index === -1) return;
          const pointMetaData = data.object as DataPoint;

          if (addressCounter > 4 && !isSignedIn) {
            void router.replace("/sign-in");
            return;
          } else {
            increaseAddressCounter(1);
          }

          mixpanel.track("click address", {
            "Property name": pointMetaData?.propertyLocation,
            Grantor: pointMetaData?.grantor,
            Grantee: pointMetaData?.grantee,
          });
          setSelectedIndex(pointMetaData.id);
          return;
        }}
      >
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          mapStyle={isSatelliteMapStyle ? satelliteMapStyle : darkMapStyle}
        />
        <Modal
          location={selectedPointData?.propertyLocation}
          grantee={selectedPointData?.grantee}
          grantor={selectedPointData?.grantor}
          lat={selectedPointData?.lat}
          lon={selectedPointData?.lon}
          onOpenChange={(open) => {
            setSelectedIndex(undefined);
          }}
          isOpen={!!selectedPointData}
        />
      </DeckGL>
      <div className="absolute z-0 flex w-full flex-col items-start gap-x-8 gap-y-2 p-4 sm:flex-row md:p-8">
        <Image src={PostCovetLogo as string} alt="postcovet" />
        <Command
          shouldFilter={false}
          className="w-full rounded-lg border shadow-md sm:max-w-xs"
        >
          <CommandInput
            onValueChange={(val) => {
              setSearchValue(val);
              setSelectedIndex(null);
            }}
            value={searchValue}
            placeholder="Search address or name"
            showClearButton={!!searchValue}
            handleClear={() => {
              setSearchValue("");
              setSelectedIndex(null);
            }}
            // onBlur={() => setInputActive(false)}
            onFocus={() => setSuggestionsVisible(true)}
          />
          <CommandList>
            {/* {searchValue && <CommandEmpty>No results found.</CommandEmpty>} */}
            {debouncedSearchValue &&
              searchValue &&
              suggestionsVisible &&
              !selectedIndex &&
              data.slice(0, 15).map((entry) => (
                <CommandItem
                  key={entry.id}
                  onSelect={() => {
                    setSearchValue(entry.prettyLocation);
                    setSelectedIndex(entry.id);
                    console.log(entry);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{entry.prettyLocation.toUpperCase()}</span>
                    {/* <span className="text-xs">{entry.grantee}</span> */}
                    <div className="flex flex-wrap">
                      {entry.grantee.split(",").map((grantee) => {
                        return (
                          <span key={grantee}>
                            <Badge variant="outline">
                              <span className="text-[10px]">{grantee}</span>
                            </Badge>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </CommandItem>
              ))}
          </CommandList>
        </Command>
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
