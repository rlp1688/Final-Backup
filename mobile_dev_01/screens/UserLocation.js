import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAxo6AjqxqiiMUBcbFjH8mNP6e9HHYhydE';

// HTML for WebView (Mobile)
const mapHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body, html { height: 100%; margin: 0; padding: 0; }
      #map { height: 90%; width: 100%; }
      #searchBox { 
        width: 80%; 
        height: 40px; 
        font-size: 16px; 
        margin: 10px auto; 
        display: block; 
        padding: 8px; 
        border-radius: 5px; 
        border: 1px solid gray; 
      }
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places"></script>
    <script>
      let map, marker, userMarker;

      function initMap() {
        var location = { lat: 51.5074, lng: -0.1278 }; // Default location (London)

        // Create the map centered at the location
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: location
        });

        marker = new google.maps.Marker({
          position: location,
          map: map,
          title: 'London'
        });

        const searchBox = new google.maps.places.SearchBox(document.getElementById('searchBox'));
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('searchBox'));

        searchBox.addListener('places_changed', function () {
          let places = searchBox.getPlaces();
          if (places.length === 0) return;

          let place = places[0];
          if (!place.geometry) return;

          map.setCenter(place.geometry.location);
          map.setZoom(12);
          marker.setPosition(place.geometry.location);
          marker.setTitle(place.name);

          // Send message to React Native instead of alert()
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "place_selected",
            name: place.name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }));
        });

        // Auto-load New York
        const service = new google.maps.places.PlacesService(map);
        service.findPlaceFromQuery(
          {
            query: 'New York, USA',
            fields: ['name', 'geometry']
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
              map.setCenter(results[0].geometry.location);
              marker.setPosition(results[0].geometry.location);
              marker.setTitle(results[0].name);

              // Send message to React Native instead of alert()
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "place_loaded",
                name: results[0].name,
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              }));
            }
          }
        );

        // Get the current location of the user and place a marker
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            // Add marker for the user's location
            userMarker = new google.maps.Marker({
              position: userLocation,
              map: map,
              title: 'Your Location',
              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Custom icon for the user's location
            });

            // Center map to user's location
            map.setCenter(userLocation);
          }, function(error) {
            alert("Error getting your location: " + error.message);
          });
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }

      window.onload = initMap;
    </script>
  </head>
  <body>
    <input id="searchBox" type="text" placeholder="Search for a place..." />
    <div id="map"></div>
  </body>
  </html>
`;

const GoogleMapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Fetch the user's location for web version
    if (Platform.OS === 'web' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, (error) => {
        alert("Error getting your location: " + error.message);
      });
    }
  }, []);

  if (Platform.OS === 'web') {
    // Web version using react-google-maps/api
    return (
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <GoogleMap mapContainerStyle={styles.map} center={userLocation || { lat: 51.5074, lng: -0.1278 }} zoom={10}>
          <Marker position={userLocation || { lat: 51.5074, lng: -0.1278 }} />
          <Autocomplete>
            <input type="text" placeholder="Search for a place..." style={styles.searchBox} />
          </Autocomplete>
        </GoogleMap>
      </LoadScript>
    );
  } else {
    // Mobile version using WebView
    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHTML }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "place_selected" || data.type === "place_loaded") {
                Alert.alert("Place Info", `Name: ${data.name}\nLatitude: ${data.lat}\nLongitude: ${data.lng}`);
              }
            } catch (error) {
              console.error("Error parsing message from WebView:", error);
            }
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, height: 500, width: '100%' },
  map: { width: '100%', height: '500px' }, // Web map size
  searchBox: { position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '40px', padding: '8px', fontSize: '16px' },
});

export default GoogleMapComponent;
