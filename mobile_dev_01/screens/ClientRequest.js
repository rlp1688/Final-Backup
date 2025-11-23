import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, AntDesign, Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAxo6AjqxqiiMUBcbFjH8mNP6e9HHYhydE';

const UserLocation = () => {
  const [location, setLocation] = useState(null);
  const [mapHTML, setMapHTML] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapRef, setMapRef] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const handleSendLocation = async () => {
    try {
      // 1. Verify location exists
      if (!location) {
        Alert.alert('Error', 'Please select a location first');
        return;
      }



      // 2. Get user token
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      // 3. Navigate to search screen with coordinates
      navigation.navigate('search', { coordinates: location });

      // 4. Send notification to mechanic panel
      navigation.navigate('mechanicPanel', {
        notification: {
          type: 'new_request',
          coordinates: location,
          token: token,
          message: 'New service request received',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error sending location:', error);
      Alert.alert('Error', 'Failed to send location');
    }
  };
    
  const handleUseCurrentLocation = async () => {
    try {
      if (Platform.OS !== 'web') {
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
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              setLocation({ lat, lng });
            },
            (error) => {
              setErrorMsg(error.message);
              setLocation({ lat: 51.5072, lng: 0.1276 });
            }
          );
        } else {
          setErrorMsg("Geolocation is not supported by this browser.");
          setLocation({ lat: 6.843914704365129, lng: 79.97369247706357 });
        }
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const firstResult = data.results[0];
        const newLocation = {
          lat: firstResult.geometry.location.lat,
          lng: firstResult.geometry.location.lng
        };
        setLocation(newLocation);
        if (Platform.OS === 'web') {
          if (mapRef) {
            mapRef.panTo(newLocation);
          }
        } else {
          setMapHTML(generateMapHTML(newLocation.lat, newLocation.lng));
        }
      } else {
        Alert.alert('No results found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search location');
      console.error(error);
    }
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  const generateMapHTML = (lat, lng) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body, html { height: 100%; margin: 0; padding: 0; }
          #map { height: 100%; width: 100%; }
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

            map.addListener('click', (e) => {
              marker.setPosition(e.latLng);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "location_changed",
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              }));
            });
          }

          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
      </html>
    `;
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>

       
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}  // Add this style
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
            <Text style={styles.headerTitle}>Your Location</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a place..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {location ? (
            <>
              <Text style={styles.coords}>
                Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.currentLocationButton]}
                  onPress={handleUseCurrentLocation}
                >
                  <Text style={styles.buttonText}>Use Current Location</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSendLocation}
                >
                  <Text style={styles.buttonText}>Find A Mechanic</Text>
                </TouchableOpacity>

             
              </View>


              <View style={styles.mapContainer}>
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={styles.webMap}
                    center={location}
                    zoom={15}
                    onLoad={map => setMapRef(map)}
                    onClick={(e) => {
                      const newLocation = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                      };
                      setLocation(newLocation);
                    }}
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
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Your Location:</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a place..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {location ? (
          <>
            <Text style={styles.coords}>
              Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.currentLocationButton]}
                onPress={handleUseCurrentLocation}
              >
                <Text style={styles.buttonText}>Use Current Location</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSendLocation}
              >
                <Text style={styles.buttonText}>Send Location</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
              <WebView
                originWhitelist={['*']}
                source={{ html: mapHTML }}
                style={styles.webview}
                onMessage={(event) => {
                  try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === "location_changed") {
                      setLocation({ lat: data.lat, lng: data.lng });
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,  // Makes the touch area larger
  },
  scrollContainer: {
    paddingBottom: 30,
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
    height: '60%',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  currentLocationButton: {
    backgroundColor: '#34A853',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#FBBC05',
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default UserLocation;