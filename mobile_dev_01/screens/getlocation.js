import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

const GetLocationFromGoogleAPI = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Attempt to get the user's location as soon as the component is mounted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          Alert.alert(
            'Your Location',
            `Latitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`
          );
        },
        (error) => {
          console.error('Error getting location:', error);
          Alert.alert('Error', 'There was a problem fetching location data.');
        }
      );
    } else {
      Alert.alert('Error', 'Geolocation is not supported by this browser/device.');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Get Location using Device Geolocation API</Text>
      {location ? (
        <Text style={styles.text}>
          Latitude: {location.lat}, Longitude: {location.lng}
        </Text>
      ) : (
        <Button title="Get My Location" onPress={() => {}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, marginBottom: 10 },
});

export default GetLocationFromGoogleAPI;
