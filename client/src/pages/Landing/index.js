import React, { useRef, useState } from "react";
import {
  GoogleMap,
  DrawingManager,
  Polygon,
  useJsApiLoader,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";
import Button from "@mui/material/Button";

const libraries = ["places", "drawing"];

const Landing = () => {
  const mapRef = useRef();
  const searchAreaRef = useRef([]);
  const activeSearchAreaRef = useRef();
  const autocompleteRef = useRef();
  const drawingManagerRef = useRef();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markers, setMarker] = useState([
    { id: 0, lat: 36.011632, lng: -84.076717 },
    { id: 1, lat: 36.038011, lng: -84.054058 },
  ]);

  const placeMarker = (e) => {
    setMarker((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    ]);
  };

  const [searchArea, setSearchArea] = useState([
    [
      { lat: 36.011632, lng: -84.076717 },
      { lat: 36.038011, lng: -84.054058 },
      { lat: 36.021838, lng: -84.091823 },
    ],
  ]);

  const centerPowell = {
    lat: 36.0319,
    lng: -84.0277,
  };
  const [center, setCenter] = useState(centerPowell);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const autocompleteStyle = {
    boxSizing: "border-box",
    border: "1px solid transparent",
    width: "240px",
    height: "38px",
    padding: "0 12px",
    borderRadius: "3px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
    fontSize: "14px",
    outline: "none",
    textOverflow: "ellipses",
    position: "absolute",
    right: "8%",
    top: "11px",
    marginLeft: "-120px",
  };

  const searchAreaOptions = {
    fillOpacity: 0.3,
    fillColor: "#ff0000",
    strokeColor: "#ff0000",
    strokeWeight: 2,
    draggable: true,
    editable: true,
  };

  const drawingManagerOptions = {
    searchAreaOptions: searchAreaOptions,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],
    },
  };

  const onLoadMap = (map) => {
    mapRef.current = map;
  };

  const onLoadSearchArea = (searchArea, index) => {
    searchAreaRef.current[index] = searchArea;
  };

  const onClickSearchArea = (index) => {
    activeSearchAreaRef.current = index;
  };

  const onLoadAutocomplete = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const { geometry } = autocompleteRef.current.getPlace();
    const bounds = new window.google.maps.LatLngBounds();
    if (geometry.viewport) {
      bounds.union(geometry.viewport);
    } else {
      bounds.extend(geometry.location);
    }
    mapRef.current.fitBounds(bounds);
  };

  const onLoadDrawingManager = (drawingManager) => {
    drawingManagerRef.current = drawingManager;
  };

  const onOverlayComplete = ($overlayEvent) => {
    drawingManagerRef.current.setDrawingMode(null);
    if ($overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
      const newSearchArea = $overlayEvent.overlay
        .getPath()
        .getArray()
        .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

      // start and end point should be same for valid geojson
      const startPoint = newSearchArea[0];
      newSearchArea.push(startPoint);
      $overlayEvent.overlay?.setMap(null);
      setSearchArea([...searchArea, newSearchArea]);
    }
  };

  const onDeleteDrawing = () => {
    const filtered = searchArea.filter(
      (searchArea, index) => index !== activeSearchAreaRef.current
    );
    setSearchArea(filtered);
  };

  const onEditSearchArea = (index) => {
    const searchAreaRef = searchAreaRef.current[index];
    if (searchAreaRef) {
      const coordinates = searchAreaRef
        .getPath()
        .getArray()
        .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

      const allSearchAreas = [...searchArea];
      allSearchAreas[index] = coordinates;
      setSearchArea(allSearchAreas);
    }
  };

  return isLoaded ? (
    <main>
      {drawingManagerRef.current && (
        <Button onClick={onDeleteDrawing} title='Delete shape' />
      )}
      <GoogleMap
        zoom={15}
        center={center}
        onLoad={onLoadMap}
        mapContainerStyle={containerStyle}
        onTilesLoaded={() => setCenter(null)}
        onClick={placeMarker}
      >
        <DrawingManager
          onLoad={onLoadDrawingManager}
          onOverlayComplete={onOverlayComplete}
          options={drawingManagerOptions}
        />
        {searchArea.map((iterator, index) => (
          <Polygon
            key={index}
            onLoad={(event) => onLoadSearchArea(event, index)}
            onMouseDown={() => onClickSearchArea(index)}
            onMouseUp={() => onEditSearchArea(index)}
            onDragEnd={() => onEditSearchArea(index)}
            options={searchAreaOptions}
            paths={iterator}
            draggable
            editable
          />
        ))}
        {markers.map((marker, index) => (
          <MarkerF
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            label={{ text: `${index}`, color: "#FFC0CB" }}
          />
        ))}
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type='text'
            placeholder='Search Location'
            style={autocompleteStyle}
          />
        </Autocomplete>
      </GoogleMap>
    </main>
  ) : (
    <>Error</>
  );
};

export default Landing;
