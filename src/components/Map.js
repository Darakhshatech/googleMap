import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerF , Polyline} from "@react-google-maps/api";


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


  const [selectedMarker, setSelectedMarker] = useState(null);
  const [distance, setDistance] = useState(null);
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
              const polyline = new window.google.maps.Polyline({
                path: response.routes[0].overview_path,
                strokeColor: "#0000FF",
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
    console.log(coordinatesList , centerCoordinate);
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
            // console.log(response)
            const meters = response.rows[0].elements.map((element) => element.distance.value);

            const kilometers = meters.map((meter) => (meter / 1000).toFixed(2));
            setDistance(kilometers);
            console.log(kilometers)
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
    // Fit the map bounds to include all markers and directions
    const bounds = new window.google.maps.LatLngBounds();
  
    // Extend bounds for markers
    coordinatesList.forEach((coordinate) => {
      bounds.extend(new window.google.maps.LatLng(coordinate.lat, coordinate.lng));
    });
  
    // Extend bounds for directions
    if (directions) {
      const overviewPath = directions.routes[0].overview_path;
      overviewPath.forEach((path) => {
        bounds.extend(path);
      });
    }
  
    map.fitBounds(bounds);
  };
  
  

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };



  const renderMarkers = () => {
    console.log("Rendering markers:", coordinatesList);
    return coordinatesList.map((coordinate, index) => (
      <MarkerF
        key={index}
        position={coordinate}
        onClick={() => handleMarkerClick(coordinate)}
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new window.google.maps.Size(30, 30),
        }}
        zIndex={1000} // Adjust the z-index as needed
        
      />
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

  {selectedMarker && (
    <InfoWindow
      position={selectedMarker}
      onCloseClick={() => setSelectedMarker(null)}
    >
      <div>
        <p>{`Distance from center: ${distance && distance[coordinatesList.indexOf(selectedMarker)]} km`}</p>
      </div>
    </InfoWindow>
  )}
</GoogleMap>



    </div>
  );
};

export default MapComponent;

