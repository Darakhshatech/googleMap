import React, { useState, useEffect } from "react";

import { GoogleMap, useLoadScript, InfoWindow, MarkerF, Polyline } from "@react-google-maps/api";
import homeIcon from '../assets/home.png'
import humanIcon from '../assets/user.png';   // adjust the path accordingly


import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";


const predefinedColors = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#800080", // Purple
  "#008080", // Teal
  "#FFA500", // Orange
  "#A52A2A", // Brown
  "#808080", // Gray
  "#000000"  // Black
  // Add more colors as needed
];


const getColorByIndex = (index) => {
  return predefinedColors[index];
};

const MapComponent = ({ coordinatesList, centerCoordinate }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });




  const polylineGet = (index) =>
  
  {
    const color = getColorByIndex(index);
    const polylineOptions = {
      strokeColor: color,
      strokeOpacity: 0.7,
      strokeWeight: 4,
    };

    return polylineOptions ; 
  }


  const [polylines, setPolylines] = useState([]);
  const [directions, setDirections] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);

 
  
  const calculateDirections = () => {
    if (isLoaded && centerCoordinate && coordinatesList && coordinatesList.length > 0) {
      const directionsService = new window.google.maps.DirectionsService();
      const newPolylines = [];

      coordinatesList.forEach((destination) => {
        directionsService.route(
          {
            origin: centerCoordinate,
            destination: destination,
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              // const strokeColor = getRandomColor();
              const polyline = new window.google.maps.Polyline({
                path: response.routes[0].overview_path,
                // strokeColor: "#D75988",
                strokeOpacity: 0.7,
                strokeWeight: 4,
              });

              newPolylines.push(polyline);
              setPolylines([...newPolylines]); // Update the state
            } else {
              console.error("Error calculating directions:", status);
            }
          }
        );
      });
    }
  };
  
  

  useEffect(() => {
    calculateDirections();

    if (isLoaded && centerCoordinate && coordinatesList && coordinatesList.length > 0) {
      const distanceMatrixService = new window.google.maps.DistanceMatrixService();
      distanceMatrixService.getDistanceMatrix(
        {
          origins: [centerCoordinate],
          destinations: coordinatesList,
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status === "OK") {
            const meters = response.rows[0].elements.map((element) => element.distance.value);
            const kilometers = meters.map((meter) => (meter / 1000).toFixed(2));

            // Create an array of selected markers with distances
            const markersWithDistances = coordinatesList.map((coordinate, index) => ({
              coordinate,
              distance: kilometers[index],
            }));

            setSelectedMarkers(markersWithDistances);
          }
        }
      );
    }
  }, [isLoaded, centerCoordinate, coordinatesList]);

  const mapContainerStyle = {
    height: "800px",
  };

  const center = centerCoordinate || coordinatesList[0];

  const onMapLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();

    coordinatesList.forEach((coordinate) => {
      bounds.extend(new window.google.maps.LatLng(coordinate.lat, coordinate.lng));
    });

    if (directions) {
      const overviewPath = directions.routes[0].overview_path;
      overviewPath.forEach((path) => {
        bounds.extend(path);
      });
    }

    map.fitBounds(bounds);
  };

  const renderMarkers = () => {
    return selectedMarkers.map((selectedMarker, index) => (
      <MarkerF
        key={index}
        position={selectedMarker.coordinate}
        icon={{
          url: index === 3? homeIcon : selectedMarker.coordinate.photo,
          scaledSize: new window.google.maps.Size(30, 30),
        }}
        zIndex={index === 0 ? 2000 : 1000}
      >
        <InfoWindow position={selectedMarker.coordinate}>
          <div className="max-w-xxxs p-1 bg-gray-200 rounded-lg shadow-md">
            <p className="text-lg font-bold mb-2"> {selectedMarker.distance == 0 ? "Center" : selectedMarker.coordinate.name}</p>
            {/* <p className="text-gray-800">
              {selectedMarker.distance == 0 ? "Center distance 0 km" : `Distance from center: ${selectedMarker.distance} km`}
            </p> */}
          </div>
        </InfoWindow>


      </MarkerF>
    ));
  };
  // const renderMarkers = () => {
  //   return selectedMarkers.map((selectedMarker, index) => (
      
  //     <MarkerF
  //       key={index}
  //       position={selectedMarker.coordinate}
  //       icon={{
  //         url: index === 3 ? homeIcon : selectedMarker.coordinate.photo, // Use the provided photo for each person
  //         scaledSize: new window.google.maps.Size(30, 30),
  //       }}
  //       zIndex={index === 0 ? 2000 : 1000}
  //     >
  //       <InfoWindow position={selectedMarker.coordinate}>
  //         <div className="max-w-xxxs p-1 bg-gray-200 rounded-lg shadow-md">
  //           <p className="text-lg font-bold mb-2">{selectedMarker.distance === 0 ? "Center" : selectedMarker.coordinate.name}</p>
  //           {/* <img src={selectedMarker.coordinate.photo} alt={`Person ${index + 1} Photo`} className="max-w-full h-auto" /> */}
  //           {/* Add other information or styling as needed */}
  //         </div>
  //       </InfoWindow>
  //     </MarkerF>
  //   ));
  // };
  



  if (loadError) {
    console.error("Map cannot be loaded:", loadError);
    return "Error loading map";
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ marginTop: "50px" }}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13} onLoad={onMapLoad}>
        {renderMarkers()}

        {polylines.map((polyline, index) => (
          <Polyline key={index} path={polyline.getPath().getArray()} options={polylineGet(index)} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;




