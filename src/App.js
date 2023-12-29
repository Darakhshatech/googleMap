import React, { useState } from "react";
import MapComponent from "./components/Map";

function App() {
  const [listCoordinates, setListCoordinates] = useState([
    { name :"sumil" ,lat: 28.69891963688101, lng: 77.15742429280348 }, // 
    { name: "rohit" ,lat: 28.70012883634028, lng: 77.16232103412547 }, 
    { name: "rakesh" ,lat: 28.80012883634028, lng: 77.17232103412547 },
    { name: "jojo" ,lat: 28.50012883634028, lng: 77.1232103412547 }, // 
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
