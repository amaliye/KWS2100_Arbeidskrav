import React, { useEffect, useRef } from "react";
import { Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "./application.css";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { FeatureLike } from "ol/Feature";

useGeographic();

const emergencySheltersLayer = new VectorLayer({
  source: new VectorSource({
    url: "KWS2100_Arbeidskrav/geojson/Tilfluktsrom.geojson",
    format: new GeoJSON(),
  }),
  style: (feature: FeatureLike) => {
    return new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: "white" }),
        stroke: new Stroke({ color: "hotpink", width: 2 }),
      }),
      text: new Text({
        text: feature.get("adresse"),
        font: "bold 14px Arial",
        fill: new Fill({ color: "black" }),
        stroke: new Stroke({ color: "white", width: 2 }),
        offsetY: -15,
      }),
    });
  },
});

/*
const focusedShelterStyle = (feature: FeatureLike) =>
  new Style({
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({ color: "hotpink", width: 2 }),
    }),
    text: new Text({
      text: feature.get("adresse"),
      font: "bold 14px Arial",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 2 }),
      offsetY: -15,
    }),
  });
*/
const civilDefenceRegionsLayer = new VectorLayer({
  source: new VectorSource({
    url: "KWS2100_Arbeidskrav/geojson/Sivilforsvarsdistrikter.geojson",
    format: new GeoJSON(),
  }),
  style: new Style({
    stroke: new Stroke({
      color: "white",
      width: 2,
    }),
  }),
});

const focusedRegionStyle = () =>
  new Style({
    fill: new Fill({
      color: "rgba(230, 250, 255, 0.3)",
    }),
    stroke: new Stroke({
      color: "white",
      width: 4,
    }),
  });

const map = new Map({
  view: new View({ center: [10.8, 59.9], zoom: 10 }),
  layers: [
    new TileLayer({ source: new OSM() }),
    emergencySheltersLayer,
    civilDefenceRegionsLayer,
  ],
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const activeFeatures = useRef<any[]>([]);

  const handlePointerMove = (event: MapBrowserEvent<MouseEvent>) => {
    for (const feature of activeFeatures.current) {
      feature.setStyle(undefined);
    }

    const civilDefenceRegions = civilDefenceRegionsLayer
      .getSource()!
      .getFeaturesAtCoordinate(event.coordinate);

    for (const feature of civilDefenceRegions) {
      feature.setStyle(focusedRegionStyle());
    }

    activeFeatures.current = civilDefenceRegions;
  };

  useEffect(() => {
    map.setTarget(mapRef.current!);
    map.on("pointermove", handlePointerMove);
  }, []);

  return (
    <>
      <header>
        <h1>Save yourself! Check your nearest emergency shelter here ! </h1>
      </header>
      <main>
        <div ref={mapRef}></div>
      </main>
    </>
  );
}
