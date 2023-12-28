import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Draw from "ol/interaction/Draw";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { LineString, Polygon } from "ol/geom";
import Feature from "ol/Feature"; // Import Feature

const MapComponent = () => {
  const mapRef = useRef(null);
  const vectorSource = useRef(new VectorSource());
  const vectorLayer = useRef(
    new VectorLayer({
      source: vectorSource.current,
    })
  );

  const [drawActive, setDrawActive] = useState(false);
  const [drawType, setDrawType] = useState("Point");
  const [drawFeature, setDrawFeature] = useState(null);

  useEffect(() => {
    let map;
    let draw;

    if (!mapRef.current) {
      map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer.current,
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      draw = new Draw({
        source: vectorSource.current,
        type: drawType,
        style: new Style({
          fill: new Fill({
            color: "rgba(173, 216, 230, 0.6)",
          }),
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: "#ffcc33",
            }),
          }),
        }),
        active: drawActive,
      });

      // Add event listener for drawStart
      draw.on("drawstart", (event) => {
        setDrawFeature(event.feature);
      });

      // Add event listener for drawEnd
      draw.on("drawend", (event) => {
        // Force LineString to close at starting coordinate
        const geometry = event.feature.getGeometry();
        if (geometry instanceof LineString) {
          const coordinates = geometry.getCoordinates();
          coordinates.push(coordinates[0]); // Add the starting coordinate to close the LineString
          geometry.setCoordinates(coordinates);

          // Create a polygon feature with the same coordinates as the LineString
          const polygon = new Polygon([coordinates]);
          const polygonFeature = new Feature({
            geometry: polygon,
          });

          // Add the polygon feature to the vector source
          vectorSource.current.addFeature(polygonFeature);
        }
      });

      setDrawFeature(null);

      map.addInteraction(draw);
    }

    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, [drawActive, drawType]);

  const toggleDraw = () => {
    setDrawActive((prevDrawActive) => !prevDrawActive);
  };

  const toggleDrawType = () => {
    setDrawType((prevDrawType) =>
      prevDrawType === "Point" ? "LineString" : "Point"
    );
  };

  return (
    <div>
      <div id='map' style={{ width: "100%", height: "400px" }}></div>
      <button onClick={toggleDraw}>
        {drawActive ? "Disable Draw" : "Enable Draw"}
      </button>
      <button onClick={toggleDrawType}>
        {drawType === "Point" ? "Switch to LineString" : "Switch to Point"}
      </button>
      {drawFeature && (
        <div>
          <h4>Drawn Feature Info:</h4>
          <p>Type: {drawFeature.getGeometry().getType()}</p>
          <p>
            Coordinates:{" "}
            {JSON.stringify(drawFeature.getGeometry().getCoordinates())}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
