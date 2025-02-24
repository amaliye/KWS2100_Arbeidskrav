import React, { useEffect, useRef } from "react";
import { Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";

useGeographic();

const emergencySheltersLayer = new VectorLayer({
  source: new VectorSource({
    url: "KWS2100_Arbeidskrav/geojson/Tilfluktsrom.geojson",
    format: new GeoJSON(),
  }),
  style: new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({ color: "green" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  }),
});

const civilDefenceRegionsLayer = new VectorLayer({
  source: new VectorSource({
    url: "KWS2100_Arbeidskrav/geojson/Sivilforsvarsdistrikter.geojson",
    format: new GeoJSON(),
  }),
  style: new Style({
    stroke: new Stroke({
      color: "rgba(150, 100, 255, 0.8)",
      width: 2,
    }),
  }),
});

const focusedStyle = () =>
  new Style({
    fill: new Fill({
      color: "rgba(230, 180, 255, 0.3)",
    }),
    stroke: new Stroke({
      color: "rgba(150, 100, 255, 1)",
      width: 2,
    }),
  });

const map = new Map({
  view: new View({ center: [15, 65], zoom: 4.7 }),
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
      feature.setStyle(focusedStyle());
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
        <h1>Our map application</h1>
      </header>
      <main>
        <div ref={mapRef}></div>
      </main>
    </>
  );
}
