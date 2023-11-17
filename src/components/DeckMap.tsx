import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, {
  GeolocateControl,
  MapRef,
  NavigationControl,
  ViewStateChangeEvent,
  useControl,
} from "react-map-gl";
import StaticMap from "react-map-gl";
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
import { Moon, Map as LucideMap, Plus } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Drawer } from "vaul";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed";
import { DeckProps, PickingInfo } from "@deck.gl/core/typed";
import { ArcLayer } from "@deck.gl/layers/typed";

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
import { cleanString, toTitleCase } from "~/lib/utils";
import BottomSheet from "./BottomSheet";
import SheetContent from "./SheetContent";
// import { ViewStateChangeEvent } from "react-map-gl/dist/esm/types";

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

const INITIAL_SEARCH_SUGGESTION_COUNT = 15;

const cleanedData = data as DataPoint[];

const blue700 = [29, 78, 216];
const orange500 = [249, 115, 22];
const rose300 = [253, 164, 175];
const rose500 = [244, 63, 94];
const slate300 = [203, 213, 225];

export default function DeckMap() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const selectedIndex = Number(router.query.i);
  const { isLoaded, isSignedIn, user } = useUser();
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 250);
  const analyticsSearchValue = useDebounce(searchValue, 1250);
  const darkMapStyle = "mapbox://styles/mapbox/dark-v11";
  const satelliteMapStyle = "mapbox://styles/mapbox/satellite-v9";
  const [searchSuggestionCount, setSearchSuggestionCount] = useState(
    INITIAL_SEARCH_SUGGESTION_COUNT,
  );

  const [isSatelliteMapStyle, setIsSatelliteMapStyle] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const addressCounter = useMapStore((state) => state.addressCounter);
  const increaseAddressCounter = useMapStore(
    (state) => state.increaseAddressCounter,
  );
  const nextIndex = useRef<null | number>(null);

  function DeckGLOverlay(
    props: MapboxOverlayProps & {
      interleaved?: boolean;
    },
  ) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
  }

  function DeckGLOverlay2(props: DeckProps) {
    const deck = useControl<MapboxOverlay>(() => new MapboxOverlay(props));

    deck.setProps(props);
    return null;
  }

  useEffect(() => {
    if (!drawerOpen && typeof nextIndex.current === "number") {
      setSelectedIndex(nextIndex.current);
      nextIndex.current = null;
    }
  }, [drawerOpen]);

  const selectedPointData = useMemo(() => {
    return typeof selectedIndex === "number"
      ? cleanedData[selectedIndex]
      : null;
  }, [selectedIndex]);

  function setSelectedIndex(i: number | null) {
    if (!i) {
      void router.push({
        pathname: "/",
      });
      return;
    } else {
      void router.push({
        pathname: "/",
        query: { i },
      });
    }
  }

  const data = useMemo(() => {
    if (!debouncedSearchValue) {
      return cleanedData;
    }
    const searchTokens = cleanString(debouncedSearchValue)
      .toUpperCase()
      .split(" ");
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
    setSearchSuggestionCount(INITIAL_SEARCH_SUGGESTION_COUNT);
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (analyticsSearchValue) {
      mixpanel.track("search", { query: analyticsSearchValue });
    }
  }, [analyticsSearchValue]);

  // I tried to memoize it, however, when zooming in, the dots completely disappear
  // const ScatterPlayLayer = useMemo(() => {
  // return new ScatterplotLayer<DataPoint>({
  const scatterplotLayer = new ScatterplotLayer<DataPoint>({
    id: "scatterplot-layer2",
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
        ? 11
        : 12,
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
  // }, [data, isSatelliteMapStyle, selectedIndex]);

  // I added an arc layer from this example:
  // to see if I could memoize this
  // https://github.com/visgl/react-map-gl/blob/master/examples/deckgl-overlay/src/app.tsx
  type DataT = {
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

  // no need to memoize, but there is a flicker going on.
  // const arcLayerMemo = useMemo(() => {
  const arcLayer = new ArcLayer<DataT>({
    // return new ArcLayer<DataT>({
    data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json",
    getSourcePosition: (d) => d.from.coordinates,
    getTargetPosition: (d) => d.to.coordinates,
    getSourceColor: [255, 200, 0],
    getTargetColor: [0, 140, 255],
    getWidth: 12,
    pickable: true,
    autoHighlight: true,
  });
  // }, [data, selectedIndex]);

  // todo - try the arclayer in the example and memoize that one and put to the layers arraay.
  const layers = [scatterplotLayer, arcLayer];
  // const layers = [arcLayer];

  const geolocateStyle: React.CSSProperties = {
    marginRight: "1.3em",
    marginBottom: "4em",
    zIndex: 1,
  };

  const mapRef = useRef(null);

  // useEffect(() => {
  //   if (typeof selectedIndex === "number" && selectedIndex > -1) {
  //     const point = cleanedData[selectedIndex];
  //     if (!point) {
  //       return;
  //     }

  //     setViewState((prev) => {
  //       return {
  //         ...prev,
  //         latitude: point.lat,
  //         longitude: point.lon,
  //         zoom: 17,
  //         transitionDuration: 1000,
  //       };
  //     });
  //   }
  // }, [selectedIndex, data]);

  useEffect(() => {
    if (typeof selectedIndex === "number" && selectedIndex > -1) {
      const point = cleanedData[selectedIndex];
      if (!point) {
        return;
      }
      setViewState((prev) => {
        return {
          ...prev,
          latitude: point.lat,
          longitude: point.lon,
          zoom: prev.zoom > 17 ? prev.zoom : 17,
          transitionDuration: 2000,
        };
      });
      // console.log("mapRef", mapRef.current);
    }
  }, [selectedIndex, data]);

  const onUserInput = useCallback(
    (evt: ViewStateChangeEvent) => {
      // console.log(evt);
      const { viewState } = evt;
      if (evt.type === "move") {
        setViewState({ ...viewState, transitionDuration: 1000 });
        return;
      }

      console.log("------------");

      if (typeof selectedIndex === "number" && selectedIndex > -1) {
        const point = cleanedData[selectedIndex];
        if (!point) {
          console.log("0. what is clicked here", point);
          setViewState({ ...viewState, transitionDuration: 1 });
          return;
        }

        // consooe
        console.log("1. does search trigger a new view state change", evt);
        console.log("2. point", point);

        // setViewState(viewState: {
        //   latitude: point.lat,
        //   longitude: point.lon,
        // });
        // return
        const newCenter = [point.lon, point.lat];

        // mapRef.current?.flyTo({ center: [83, 23] });
        console.log(mapRef, "map ref");

        setViewState((prev) => {
          return {
            ...prev,
            latitude: point.lat,
            longitude: point.lon,
            zoom: 17,
            transitionDuration: 1000,
          };
        });

        // setViewState((prev) => {
        //   console.log("1. does search trigger a new view state change", prev);
        //   console.log("2. point", point);
        //   return {
        //     ...prev,
        //     latitude: point.lat,
        //     longitude: point.lon,
        //     zoom: 17,
        //     transitionDuration: 1000,
        //   };
        // });
      }
    },
    [selectedIndex],
  );

  function getSearchSuggestions() {
    function getSuggestionFooter() {
      if (data.length > searchSuggestionCount) {
        return (
          <div className="p-4">
            <Button
              onClick={() => {
                setSearchSuggestionCount((prev) => prev + 15);
              }}
              variant="outline"
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Show more
            </Button>
          </div>
        );
      } else if (searchSuggestionCount > INITIAL_SEARCH_SUGGESTION_COUNT) {
        return (
          <p className="p-2 text-center text-sm italic text-neutral-500">
            All items in view
          </p>
        );
      }
    }
    if (
      debouncedSearchValue &&
      searchValue &&
      suggestionsVisible &&
      !selectedIndex
    ) {
      return (
        <>
          <CommandGroup
            heading={
              !!data.length
                ? `${data.length} results`
                : `${data.length} results. Single family residentials for now =)`
            }
          >
            {data.slice(0, searchSuggestionCount).map((entry) => (
              <CommandItem
                key={entry.id}
                onSelect={() => {
                  setSearchValue(toTitleCase(entry.prettyLocation));
                  setSelectedIndex(entry.id);
                  console.log(entry);
                }}
              >
                <div className="flex flex-col">
                  <span>{toTitleCase(entry.prettyLocation)}</span>
                  {entry.grantee ? (
                    <div className="flex flex-wrap">
                      {entry.grantee.split(",").map((grantee) => {
                        return (
                          <span key={grantee} className="p-0.5">
                            <Badge variant="outline">
                              <span className="text-[10px]">
                                {toTitleCase(grantee)}
                              </span>
                            </Badge>
                          </span>
                        );
                      })}
                    </div>
                  ) : null}{" "}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          {getSuggestionFooter()}
        </>
      );
    }
  }

  return (
    <>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle={isSatelliteMapStyle ? satelliteMapStyle : darkMapStyle}
        // attributionControl={false}
        {...viewState}
        ref={mapRef}
        // onMove={(evt) =>
        //   setViewState({ ...evt.viewState, transitionDuration: 0 })
        // }
        onMove={onUserInput}
        // {...viewState}
        // onMove={(evt) =>
        //   // setViewState({ ...evt.viewState, transitionDuration: 0 })
        //   setViewState(evt)
        // }
        // onViewportChange={(viewState) => setViewState(viewState)}
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          overflow: "hidden",
        }}
      >
        <DeckGLOverlay
          interleaved={true}
          getTooltip={({ object }: { object?: DataPoint | null }) => {
            if (object?.prettyLocation) {
              return {
                text: `Property Location: ${object.prettyLocation.toUpperCase()}
            Grantor: ${object.grantor}
            Grantee: ${object.grantee}`,
              };
            } else {
              return null;
            }
          }}
          layers={layers}
          onClick={(data) => {
            setSuggestionsVisible(false);
            if (!data.layer) {
              console.log("setting to null 215");
              setSelectedIndex(null);
              return;
            }

            if (data.index === -1) {
              return;
            }
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
            if (!drawerOpen) {
              setSelectedIndex(pointMetaData.id);
            } else {
              nextIndex.current = pointMetaData.id;
            }
            return;
          }}
        />
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          position="bottom-right"
        />

        {window.innerWidth > 800 ? (
          <Modal
            location={selectedPointData?.propertyLocation}
            grantee={selectedPointData?.grantee}
            grantor={selectedPointData?.grantor}
            lat={selectedPointData?.lat}
            lon={selectedPointData?.lon}
            isOpen={!!selectedPointData}
          >
            <SheetContent
              location={selectedPointData?.prettyLocation}
              grantee={selectedPointData?.grantee}
              grantor={selectedPointData?.grantor}
            />
          </Modal>
        ) : (
          <BottomSheet
            open={!!selectedPointData}
            onClose={() => {
              setSelectedIndex(null);
            }}
            location={selectedPointData?.prettyLocation}
            grantee={selectedPointData?.grantee}
            grantor={selectedPointData?.grantor}
            lat={selectedPointData?.lat}
            lon={selectedPointData?.lon}
          >
            <SheetContent
              location={selectedPointData?.prettyLocation}
              grantee={selectedPointData?.grantee}
              grantor={selectedPointData?.grantor}
            />
          </BottomSheet>
        )}
      </Map>

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
            placeholder="Search an address or name in SF"
            showClearButton={!!searchValue}
            handleClear={() => {
              setSearchValue("");
              setSelectedIndex(null);
            }}
            onFocus={() => setSuggestionsVisible(true)}
          />
          <CommandList>{getSearchSuggestions()}</CommandList>
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
