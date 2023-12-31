import React, { useEffect, useState, useRef } from "react";
import GeoJSON from "ol/format/GeoJSON.js";
import Draw from "ol/interaction/Draw.js";
import { Modify } from "ol/interaction.js";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Point from "ol/geom/Point.js";
import Feature from "ol/Feature.js";
import Select from "ol/interaction/Select.js";

import XYZ from "ol/source/XYZ.js";
import { Fill, Style, Text, Icon } from "ol/style.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { getCenter } from "ol/extent.js";
import "./style.css";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [type, setType] = useState("LineString"); // Default type
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [userFeatures, setUserFeatures] = useState([]); // User-added features
  const mapContainerRef = useRef(null); // Ref for the map container element

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const addUserFeature = (geometry) => {
    setUserFeatures((prevUserFeatures) => [
      ...prevUserFeatures,
      new Feature({
        geometry: geometry,
        geometryName: "DefaultName", // Default name for the geometry
      }),
    ]);
  };

  const handleNameChange = (event, index) => {
    const newName = event.target.value;
    setUserFeatures((prevUserFeatures) => {
      const updatedFeatures = [...prevUserFeatures];
      updatedFeatures[index].set("geometryName", newName);
      return updatedFeatures;
    });
  };

<<<<<<< Updated upstream
  // Handles the submission of the text input value
  const handleSubmit = () => {
    // Tests textValue call
    // console.log("Submitted Text Value: ", textValue);

    // Updates the style of map features with the submitted textValue
    if (map) {
      const vectorLayer = map.getLayers().item(1);
      if (vectorLayer) {
        const style = new Style({
          text: new Text({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            // sets text to state textValue
            text: textValue,
          }),
        });

        // Updates the style of the map features, this might be why all of them are being updated?
        vectorLayer.setStyle(function () {
          style.getText().setText(textValue);
          return style;
        });
      }
    }
  };

  // Inits map
=======
>>>>>>> Stashed changes
  useEffect(() => {
    // Check if the map is already initialized to prevent double initialization
    if (map !== null) {
      return;
    }

    const iconFeature = new Feature({
      geometry: new Point([0, 0]),
      name: "Null Island",
      population: 4000,
      rainfall: 500,
    });

    const style = new Style({
      text: new Text({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        text: "Test",
      }),
    });

    const raster = new TileLayer({
      source: new OSM(),
    });

    const source = new VectorSource({ wrapX: false, features: [iconFeature] });

    const vector = new VectorLayer({
      source: source,
      style: function (feature) {
        style.getText().setText(() => "Test");
        return style;
      },
    });

    const newMap = new Map({
      layers: [raster, vector],
      target: mapContainerRef.current, // Use the target element
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
      }),
    });

    const modify = new Modify({
      hitDetection: vector,
      source: source,
    });
    modify.on(["modifystart", "modifyend"], function (evt) {
      mapContainerRef.current.style.cursor =
        evt.type === "modifystart" ? "grabbing" : "pointer";
    });
    const overlaySource = modify.getOverlay().getSource();
    overlaySource.on(["addfeature", "removefeature"], function (evt) {
      mapContainerRef.current.style.cursor =
        evt.type === "addfeature" ? "pointer" : "";
    });

    newMap.addInteraction(modify);

    setMap(newMap);

    // Cleanup: remove the draw interaction when the component unmounts
    return () => {
      if (drawInteraction) {
        newMap.removeInteraction(drawInteraction);
      }
    };
  }, []);

  useEffect(() => {
    // Create or update the draw interaction based on the selected geometry type
    if (map && type !== "None") {
      if (drawInteraction) {
        map.removeInteraction(drawInteraction);
      }

      const newDrawInteraction = new Draw({
        source: map.getLayers().item(1).getSource(), // Assuming vector layer is at index 1
        type: type,
        freehand: true,
        geometryName: "Test",
      });

      newDrawInteraction.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        addUserFeature(geometry);
<<<<<<< Updated upstream
        // Test geometry call
        // console.log("User added feature: ", geometry);
=======
        console.log("User added feature: ", geometry);
>>>>>>> Stashed changes
      });

      map.addInteraction(newDrawInteraction);
      setDrawInteraction(newDrawInteraction);
    }
  }, [map, type]);

  // Toggle the icon feature visibility
  useEffect(() => {
    if (map) {
      const vectorLayer = map.getLayers().item(1); // Assuming vector layer is at index 1
      if (vectorLayer) {
        vectorLayer.setVisible(true); // Always show icon feature
      }
    }
  }, [map]);

  console.log(userFeatures);

  return (
    <div>
      <div ref={mapContainerRef} className='map'></div>
      <form>
        <label htmlFor='type'>Geometry type &nbsp;</label>
        <select id='type' value={type} onChange={handleTypeChange}>
          <option value='LineString'>LineString</option>
          <option value='Polygon'>Polygon</option>
          <option value='Circle'>Circle</option>
          <option value='Point'>Point</option>
        </select>
      </form>
      <div>
        <h2>User-Added Features:</h2>
        <ul>
          {userFeatures.map((feature, index) => (
            <li key={index}>
              Feature {index + 1}:{" "}
              <input
                type='text'
                value={feature.get("geometryName")}
                onChange={(event) => handleNameChange(event, index)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;
