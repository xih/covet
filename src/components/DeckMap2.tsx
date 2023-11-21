"use client";

import React, { useCallback, useState } from "react";
import Map, {
  GeolocateControl,
  MapRef,
  NavigationControl,
  ViewStateChangeEvent,
  useControl,
} from "react-map-gl";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed";
import { DeckProps, PickingInfo } from "@deck.gl/core/typed";
import { ArcLayer } from "@deck.gl/layers/typed";

import "mapbox-gl/dist/mapbox-gl.css";

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

export default function DeckMap2() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const darkMapStyle = "mapbox://styles/mapbox/dark-v11";

  const geolocateStyle: React.CSSProperties = {
    marginRight: "1.3em",
    marginBottom: "10em",
    zIndex: 1,
  };

  function DeckGLOverlay(
    props: MapboxOverlayProps & {
      interleaved?: boolean;
    },
  ) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
  }

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

  const layers = [arcLayer];

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      setViewState({
        ...evt.viewState,
        transitionDuration: 0,
      });
    },
    [viewState],
  );

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle={darkMapStyle}
      {...viewState}
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        overflow: "hidden",
      }}
      onMove={onMove}
    >
      <DeckGLOverlay interleaved={true} layers={layers} />
      <GeolocateControl
        style={geolocateStyle}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        position="bottom-right"
      />
    </Map>
  );
}
