import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

useGeographic();

const emergencySheltersLayer = new VectorLayer({
  source: new VectorSource({
    url: "KWS2100_Arbeidskrav/public/geojson/Tilfluktsrom.geojson",
    format: new GeoJSON(),
  }),
});

const civilDefenceRegionsLayer = new VectorLayer({
  source: new VectorSource({
    url: "KWS2100_Arbeidskrav/public/geojson/Sivilforsvarsdistrikter.geojson",
    format: new GeoJSON(),
  }),
});

const map = new Map({
  view: new View({ center: [10.8, 59.9], zoom: 13 }),
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

  return <div ref={mapRef}></div>;
}
