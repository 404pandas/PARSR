import { useEffect, useState, useRef } from "react";
import Draw from "ol/interaction/Draw.js";
import { Modify } from "ol/interaction.js";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Point from "ol/geom/Point.js";
import Feature from "ol/Feature.js";
import { Style, Text } from "ol/style.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import "./style.css";

const MapComponent = () => {
  // State variables
  const [map, setMap] = useState(null);
  const [type, setType] = useState("Point");
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [userFeatures, setUserFeatures] = useState([]);
  const [textValue, setTextValue] = useState("Insert Name");
  const mapContainerRef = useRef(null);

  // Handles changes in Type (Point, LineString, Polygon, Circle)
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  // Adds a user feature to the map
  const addUserFeature = (geometry) => {
    setUserFeatures((prevUserFeatures) => [
      ...prevUserFeatures,
      new Feature({
        geometry: geometry,
      }),
    ]);
  };

  // Handles changes in TextValue
  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

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
  useEffect(() => {
    // Checks if the map is already there - debugged multiple maps being created
    if (map !== null) {
      return;
    }

    // Creates an icon feature for the map, no idea if this is actually working
    const iconFeature = new Feature({
      geometry: new Point([0, 0]),
      name: "Null Island",
      population: 4000,
      rainfall: 500,
    });

    // Create a style for the icon
    const style = new Style({
      text: new Text({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        text: textValue, // Use the state value
      }),
    });

    const raster = new TileLayer({
      source: new OSM(),
    });

    const source = new VectorSource({ wrapX: false, features: [iconFeature] });

    const vectorLayer = new VectorLayer({
      source: source,
      style: function () {
        // apply a style config object to each feature
        style.getText().setText(textValue);
        return style;
      },
    });

    const newMap = new Map({
      layers: [raster, vectorLayer],
      // uses the target ref to create the map
      target: mapContainerRef.current,
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
      }),
    });

    const modify = new Modify({
      hitDetection: vectorLayer,
      source: source,
    });

    // Handle cursor styles during modification interactions
    modify.on(["modifystart", "modifyend"], function (evt) {
      mapContainerRef.current.style.cursor =
        evt.type === "modifystart" ? "grabbing" : "pointer";
    });

    const overlaySource = modify.getOverlay().getSource();

    // Handle cursor styles during overlay source events
    overlaySource.on(["addfeature", "removefeature"], function (evt) {
      mapContainerRef.current.style.cursor =
        evt.type === "addfeature" ? "pointer" : "";
    });

    newMap.addInteraction(modify);

    setMap(newMap);

    // Remove the draw interaction when the component unmounts
    return () => {
      if (drawInteraction) {
        newMap.removeInteraction(drawInteraction);
      }
    };
  }, [textValue]);

  // Creates or updates the draw based on the selected geometry type
  useEffect(() => {
    if (map && type !== "None") {
      if (drawInteraction) {
        map.removeInteraction(drawInteraction);
      }

      const newDrawInteraction = new Draw({
        source: map.getLayers().item(1).getSource(), // Assuming vector layer is at index 1
        type: type,
        freehand: true,
      });

      newDrawInteraction.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        addUserFeature(geometry);
        // Test geometry call
        // console.log("User added feature: ", geometry);
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
        <h2>Points of Interest:</h2>
        <ul>
          {userFeatures.map((feature, index) => (
            <li key={index}>
              Feature {index + 1}: {textValue}
            </li>
          ))}
        </ul>
      </div>
      {/* Display the text input */}
      <div>
        <label htmlFor='textValue'>Text Value: &nbsp;</label>
        <input
          type='text'
          id='textValue'
          value={textValue}
          onChange={handleTextChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default MapComponent;
