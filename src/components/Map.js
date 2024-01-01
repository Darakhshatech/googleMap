import React, { useState, useEffect } from "react";

import { GoogleMap, useLoadScript, InfoWindow, MarkerF, Polyline } from "@react-google-maps/api";
import homeIcon from '../assets/home.png'
import humanIcon from '../assets/user.png';   // adjust the path accordingly


import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";


const MapComponent = ({ coordinatesList, centerCoordinate }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });
  const polylineOptions = {
    strokeColor: "#0000FF",
    strokeOpacity: 0.7,
    strokeWeight: 4,
  };

  const [polylines, setPolylines] = useState([]);
  const [directions, setDirections] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  // const calculateDirections = () => {
  //   if (isLoaded && centerCoordinate && coordinatesList && coordinatesList.length > 0) {
  //     const directionsService = new window.google.maps.DirectionsService();
  //     const newPolylines = [];

  //     coordinatesList.forEach((destination) => {
  //       directionsService.route(
  //         {
  //           origin: centerCoordinate,
  //           destination: destination,
  //           travelMode: "DRIVING",
  //         },
  //         (response, status) => {
  //           if (status === "OK") {
  //             const polyline = new window.google.maps.Polyline({
  //               path: response.routes[0].overview_path,
  //               strokeColor: "#0000FF",
  //               strokeOpacity: 0.7,
  //               strokeWeight: 4,
  //             });

  //             newPolylines.push(polyline);
  //             setPolylines([...newPolylines]); // Update the state
  //           } else {
  //             console.error("Error calculating directions:", status);
  //           }
  //         }
  //       );
  //     });
  //   }
  // };
  const calculateDirections = () => {
    if (isLoaded && centerCoordinate && coordinatesList && coordinatesList.length > 0) {
      const directionsService = new window.google.maps.DirectionsService();
      const newPolylines = [];
  
      const updatePolylines = (color, response) => {
        const polyline = new window.google.maps.Polyline({
          path: response.routes[0].overview_path,
          strokeColor: color,
          strokeOpacity: 0.7,
          strokeWeight: 4,
        });
  
        newPolylines.push(polyline);
  
        if (newPolylines.length === coordinatesList.length) {
          setPolylines([...newPolylines]); // Update the state after all polylines are created
        }
      };
  
      coordinatesList.forEach((destination, index) => {
        let color = '';
  
        // Assign colors based on index ranges
        if (index >= 0 && index < 2) {
          color = 'red';
        } else if (index >= 2 && index < 4) {
          color = 'blue';
        } else if (index >= 4 && index < 6) {
          color = 'green';
        }
        // Add more conditions as needed
  
        directionsService.route(
          {
            origin: centerCoordinate,
            destination: destination,
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              updatePolylines(color, response);
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
          url: index === 3? homeIcon : humanIcon,
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
          <Polyline key={index} path={polyline.getPath().getArray()} options={polylineOptions} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;




