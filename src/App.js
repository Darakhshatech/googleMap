import React, { useState } from "react";

import MapComponent from "./components/Map";

function App() {
  const [listCoordinates, setListCoordinates] = useState([
    // { name :"sumil" ,lat: 28.70068083198597, lng: 77.16055157429982 },28.70068083198597,77.16055157429982
    { name: "rohit" ,lat: 28.7006327063655, lng: 77.15894548287578 , photo: 'https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/08/cartoons-for-kids.jpg'}, //28.7006327063655, 77.15894548287578
    { name: "rakesh" ,lat: 28.700382688610425, lng: 77.1583621380241, photo: 'https://wallpapers.com/images/high/cartoon-pictures-ty2cqbq2er9iov7h.webp'},//28.700382688610425, 77.1583621380241
    { name: "jojo" ,lat: 28.700989109801004, lng: 77.15827660875983 ,photo: "https://www.loudegg.com/wp-content/uploads/2020/10/Mickey-Mouse.jpg" }, // 28.700989109801004, 77.15827660875983
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
      <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          className="p-2 border border-gray-300 mr-2"
          placeholder="Enter the coordinate lat long"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleInputSubmit}
        >
          Center Coordinate
        </button>
      </div>
      <div className="h-screen w-full">
        <MapComponent coordinatesList={listCoordinates} centerCoordinate={centerCoordinate} />
      </div>
    </div>
    </>
  );
}

export default App;
