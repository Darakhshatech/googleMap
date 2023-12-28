import React from "react";
import MapComponent from "./components/Map";

function App() {
  const listCoordinates = [
    { lat: 37.7749, lng: -122.4194 }, // Example coordinate 1 (San Francisco, CA)
    { lat: 34.0522, lng: -118.2437 }, // Example coordinate 2 (Los Angeles, CA)
    { lat: 41.8781, lng: -87.6298 },  // Example coordinate 3 (Chicago, IL)
    { lat: 41.2781, lng: -87.6298 },  // Example coordinate 3 (Chicago, IL)
    { lat: 41.1781, lng: -87.6298 },  // Example coordinate 3 (Chicago, IL)
  ];

  const centerCoordinate = listCoordinates.length > 0 ? listCoordinates[0] : null; // Use the first coordinate as the center

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapComponent coordinatesList={listCoordinates} centerCoordinate={centerCoordinate} />
    </div>
  );
}

export default App;
