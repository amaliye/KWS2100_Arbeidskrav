import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

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
      color: "purple",
      width: 2,
    }),
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
  useEffect(() => {
    map.setTarget(mapRef.current!);
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
