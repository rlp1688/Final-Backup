import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview'; // For mobile
import { TextInput, Button } from 'react-native';

const GOOGLE_PLACES_API_KEY = 'AIzaSyAxo6AjqxqiiMUBcbFjH8mNP6e9HHYhydE';

const PlaceDetails = () => {
  const [placeData, setPlaceData] = useState(null);
  const [mapHTML, setMapHTML] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const initialMapHTML = generateMapHTML(51.5074, -0.1278);  // Default to London
    setMapHTML(initialMapHTML);
  }, []);

  const generateMapHTML = (lat, lng) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body, html { height: 100%; margin: 0; padding: 0; }
          #map { height: 100%; width: 100%; }
          #searchBoxContainer {
            position: absolute;
            top: 20px; 
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            z-index: 10;
            background: white;
            border-radius: 10px;
            padding: 5px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
          }
          #searchBox {
            width: 100%;
            height: 40px;
            font-size: 16px;
            padding: 8px;
            border-radius: 5px;
            border: 1px solid gray;
          }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places&callback=initMap" async defer></script>
        <script>
          let map, marker;
          function initMap() {
            var location = { lat: ${lat}, lng: ${lng} };  
            map = new google.maps.Map(document.getElementById('map'), {
              zoom: 12,
              center: location
            });

            marker = new google.maps.Marker({
              position: location,
              map: map,
              title: 'Place'
            });

            const searchBox = new google.maps.places.SearchBox(document.getElementById('searchBox'));
            searchBox.addListener('places_changed', function () {
              let places = searchBox.getPlaces();
              if (!places || places.length === 0) {
                sendMessage("error", "No places found. Try another search.");
                return;
              }

              let place = places[0];
              if (!place.geometry) {
                sendMessage("error", "Selected place has no geometry data.");
                return;
              }

              map.setCenter(place.geometry.location);
              map.setZoom(14);
              marker.setPosition(place.geometry.location);
              marker.setTitle(place.name);

              sendMessage("place_selected", JSON.stringify({
                name: place.name,
                address: place.formatted_address || "No address available",
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                place_id: place.place_id || "No Place ID"
              }));
            });

            sendMessage("status", "Google Places API Loaded Successfully");
          }

          function sendMessage(type, message) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type, message }));
          }
          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="searchBoxContainer">
          <input id="searchBox" type="text" placeholder="Search for a place... " />
        </div>
        <div id="map"></div>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "place_selected") {
        const place = JSON.parse(data.message);
        Alert.alert("Place Info", `📍 Name: ${place.name}\n🏠 Address: ${place.address}\n🌍 Latitude: ${place.lat}\n🌍 Longitude: ${place.lng}\n🆔 Place ID: ${place.place_id}`);
      } else if (data.type === "error") {
        Alert.alert("❌ Error", data.message);
      } else if (data.type === "status") {
        console.log("✅ Status:", data.message);
      }
    } catch (error) {
      console.error("Error handling WebView message:", error);
    }
  };

  const searchPlace = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a valid search query');
      return;
    }

    // Use Geocoding API to fetch the coordinates for the place
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK' && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocation({ lat, lng });

          // Update the map with the new location
          const newMapHTML = generateMapHTML(lat, lng);
          setMapHTML(newMapHTML);
        } else {
          Alert.alert('Error', 'Place not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching geocoding data:', error);
        Alert.alert('Error', 'There was a problem fetching geocoding data.');
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>Search for a Place:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter place name"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Button title="Search" onPress={searchPlace} />
        
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              title="Google Map"
              srcDoc={mapHTML}
              width="100%"
              height="500px"
              style={{ border: 'none' }}
            />
          ) : (
            <WebView
              originWhitelist={['*']}
              source={{ html: mapHTML }}
              onMessage={handleWebViewMessage}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  text: { fontSize: 16, marginVertical: 5 },
  input: { width: '80%', height: 40, borderColor: 'gray', borderWidth: 1, padding: 8, marginBottom: 20 },
  mapContainer: { width: '100%', flex: 1 }
});

export default PlaceDetails;
