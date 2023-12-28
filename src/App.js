import React, { useState } from "react";
import MapComponent from "./components/Map";

function App() {
  const [listCoordinates, setListCoordinates] = useState([
    { lat: 34.0522, lng: -118.2437 }, // Example coordinate 2 (Los Angeles, CA)
    { lat: 41.8781, lng: -87.6298 },  // Example coordinate 3 (Chicago, IL)
  ]);

  const [centerCoordinate, setCenterCoordinate] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    // Assuming input format is "lat, lng"
    const [lat, lng] = inputValue.split(',').map(coord => parseFloat(coord.trim()));
    
    // Check if lat and lng are valid numbers
    if (!isNaN(lat) && !isNaN(lng)) {
      const newCoordinate = { lat, lng };
      setListCoordinates([...listCoordinates, newCoordinate]);
      setCenterCoordinate(newCoordinate);
    } else {
      // Handle invalid input
      console.error("Invalid input. Please enter valid latitude and longitude.");
    }
  };

  return (
    <>
      <div>
        <input
          placeholder="Enter the coordinate lat long"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleInputSubmit}>Center Coordinate</button>
      </div>
      <div style={{ height: "100vh", width: "100%" }}>
        <MapComponent coordinatesList={listCoordinates} centerCoordinate={centerCoordinate} />
      </div>
    </>
  );
}

export default App;
