import { useEffect, useRef } from "react";
import Feature from "ol/Feature.js";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { LineString, Point, Polygon } from "ol/geom.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import {
  Pointer as PointerInteraction,
  defaults as defaultInteractions,
} from "ol/interaction.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import marker from "../../assets/images/map-marker.png";

console.log(marker);

const Drag = new PointerInteraction({
  handleDownEvent: handleDownEvent,
  handleDragEvent: handleDragEvent,
  handleMoveEvent: handleMoveEvent,
  handleUpEvent: handleUpEvent,
});

let map;

const MapWithDragInteraction = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const pointFeature = new Feature(new Point([0, 0]));
    pointFeature.set("draggable", true); // Make the icon draggable

    const lineFeature = new Feature(
      new LineString([
        [-1e7, 1e6],
        [-1e6, 3e6],
      ])
    );

    const polygonFeature = new Feature(
      new Polygon([
        [
          [-3e6, -1e6],
          [-3e6, 1e6],
          [-1e6, 1e6],
          [-1e6, -1e6],
          [-3e6, -1e6],
        ],
      ])
    );

    map = new Map({
      interactions: defaultInteractions().extend([Drag]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [pointFeature, lineFeature, polygonFeature],
          }),
          style: {
            "icon-src": marker,
            "icon-width": 35,
            "icon-height": 50,
            "icon-opacity": 0.95,
            "icon-anchor": [0.5, 46],
            "icon-anchor-x-units": "fraction",
            "icon-anchor-y-units": "pixels",
            "stroke-width": 3,
            "stroke-color": [255, 0, 0, 1],
            "fill-color": [0, 0, 255, 0.6],
          },
        }),
      ],
      target: mapContainer.current,
      view: new View({
        // Knoxille - 35.9606° N, 83.9207° W
        center: [35, 83],
        zoom: 2,
      }),
    });

    return () => {
      if (map) {
        map.dispose();
      }
    };
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
};

function handleDownEvent(evt) {
  const map = evt.map;

  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    this.coordinate_ = evt.coordinate;
    this.feature_ = feature;
  }

  return !!feature;
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
 */
function handleDragEvent(evt) {
  const deltaX = evt.coordinate[0] - this.coordinate_[0];
  const deltaY = evt.coordinate[1] - this.coordinate_[1];

  const geometry = this.feature_.getGeometry();
  geometry.translate(deltaX, deltaY);

  this.coordinate_[0] = evt.coordinate[0];
  this.coordinate_[1] = evt.coordinate[1];
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Event.
 */
function handleMoveEvent(evt) {
  if (this.cursor_) {
    const map = evt.map;
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
    const element = evt.map.getTargetElement();
    if (feature) {
      if (element.style.cursor != this.cursor_) {
        this.previousCursor_ = element.style.cursor;
        element.style.cursor = this.cursor_;
      }
    } else if (this.previousCursor_ !== undefined) {
      element.style.cursor = this.previousCursor_;
      this.previousCursor_ = undefined;
    }
  }
}

/**
 * @return {boolean} `false` to stop the drag sequence.
 */
function handleUpEvent() {
  this.coordinate_ = null;
  this.feature_ = null;
  return false;
}

export default MapWithDragInteraction;
