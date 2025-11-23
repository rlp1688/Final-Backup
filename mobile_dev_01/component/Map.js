import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const GetLocationFromExpo = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to continue.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });

      Alert.alert(
        'Your Location',
        `Latitude: ${currentLocation.coords.latitude}\nLongitude: ${currentLocation.coords.longitude}`
      );
    };

    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Get Location using Expo Location API</Text>
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

export default GetLocationFromExpo;
