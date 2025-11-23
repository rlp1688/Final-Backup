import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAxo6AjqxqiiMUBcbFjH8mNP6e9HHYhydE';

const UserLocation = () => {
  const [location, setLocation] = useState(null);
  const [mapHTML, setMapHTML] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const handleSendLocation = () => {
    navigation.navigate('search', { coordinates: location });
  };

  // ... rest of your component ...


  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (Platform.OS !== 'web') {
          // Mobile: Use Expo Location
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }

          let currentLocation = await Location.getCurrentPositionAsync({});
          const lat = currentLocation.coords.latitude;
          const lng = currentLocation.coords.longitude;
          setLocation({ lat, lng });
          setMapHTML(generateMapHTML(lat, lng));
        } else {
          // Web: Use browser geolocation
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setLocation({ lat, lng });
              },
              (error) => {
                setErrorMsg(error.message);
                // Fallback to default location if geolocation fails
                setLocation({ lat: 51.5072, lng: 0.1276 });
              }
            );
          } else {
            setErrorMsg("Geolocation is not supported by this browser.");
            // Fallback to default location
            setLocation({ lat: 6.843914704365129, lng: 79.97369247706357 });
          }
        }
      } catch (error) {
        setErrorMsg(error.message);
      }
    };

    fetchLocation();
  }, []);

  const generateMapHTML = (lat, lng) => {
    return `
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
            var location = { lat: ${lat}, lng: ${lng} };
            
            map = new google.maps.Map(document.getElementById('map'), {
              zoom: 15,
              center: location
            });

            marker = new google.maps.Marker({
              position: location,
              map: map,
              title: 'Your Location',
              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });

            const searchBox = new google.maps.places.SearchBox(document.getElementById('searchBox'));
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('searchBox'));

            searchBox.addListener('places_changed', function () {
              let places = searchBox.getPlaces();
              if (places.length === 0) return;

              let place = places[0];
              if (!place.geometry) return;

              map.setCenter(place.geometry.location);
              map.setZoom(15);
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
  };

  if (Platform.OS === 'web') {
    // Web version using react-google-maps/api
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Your Location:</Text>
        {location ? (
          <>
            <Text style={styles.coords}>
              Latitude: {location.lat}, Longitude: {location.lng}
            </Text>

            <TouchableOpacity 
            style={styles.button} 
            onPress={handleSendLocation}
          >
            <Text style={styles.buttonText}>Send Location</Text>
          </TouchableOpacity>

            <View style={styles.mapContainer}>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
                <GoogleMap
                  mapContainerStyle={styles.webMap}
                  center={location}
                  zoom={15}
                >
                  <Marker
                    position={location}
                    title="Your Location"
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }}
                  />
                </GoogleMap>
              </LoadScript>
            </View>
          </>
        ) : errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : (
          <Text style={styles.loading}>Fetching location...</Text>
        )}
      </SafeAreaView>
    );

    
  } else {
    // Mobile version using WebView
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Your Location:</Text>
        {location ? (
          <>
            <Text style={styles.coords}>
              Latitude: {location.lat}, Longitude: {location.lng}
            </Text>

            <TouchableOpacity 
            style={styles.button} 
            onPress={handleSendLocation}
          >
            <Text style={styles.buttonText}>Send Location</Text>
          </TouchableOpacity>

            <View style={styles.mapContainer}>
              <WebView
                originWhitelist={['*']}
                source={{ html: mapHTML }}
                style={styles.webview}
                onMessage={(event) => {
                  try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === "place_selected") {
                      Alert.alert(
                        "Place Selected",
                        `Name: ${data.name}\nLat: ${data.lat}\nLng: ${data.lng}`
                      );
                    }
                  } catch (error) {
                    console.error("Error parsing message:", error);
                  }
                }}
              />
            </View>
          </>
        ) : errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : (
          <Text style={styles.loading}>Fetching location...</Text>
        )}
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  coords: {
    fontSize: 16,
    marginBottom: 16,
  },
  loading: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  mapContainer: {
    width: '100%',
    height: '70%',
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  webMap: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserLocation;