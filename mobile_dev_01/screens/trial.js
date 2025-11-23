import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios'; // Make sure to install axios
const GOOGLE_MAPS_API_KEY = 'AIzaSyAxo6AjqxqiiMUBcbFjH8mNP6e9HHYhydE'
const mapHTML = (lat, lng) => `
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
      let map, marker;

      function initMap() {
        var location = { lat: ${lat}, lng: ${lng} }; // Use the passed user location

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: location
        });

        marker = new google.maps.Marker({
          position: location,
          map: map,
          title: 'Your Location'
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

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "place_selected",
            name: place.name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }));
        });
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
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    // Get the user's location using Google Geolocation API
    const fetchLocation = async () => {
      try {
        const response = await axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=' + GOOGLE_MAPS_API_KEY, {
          homeMobileCountryCode: 310,
          homeMobileNetworkCode: 410,
          radioType: 'gsm',
          carrier: 'Vodafone',
          considerIp: true
        });

        const { lat, lng } = response.data.location;
        setUserLocation({ lat, lng });
      } catch (error) {
        setLocationError(true);
        Alert.alert('Error', 'Unable to fetch your location using Geolocation API');
      }
    };

    fetchLocation();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML(51.5074, -0.1278) }} // Default location for web version
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
    );
  } else if (userLocation) {
    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHTML(userLocation.lat, userLocation.lng) }} // Pass user location to HTML template
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
  } else if (locationError) {
    // You can show a different message or handle it accordingly
    return (
      <View style={styles.container}>
        
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
       
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, height: 500, width: '100%' },
});

export default GoogleMapComponent;
