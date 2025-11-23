import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons, FontAwesome, AntDesign, Ionicons, Entypo } from '@expo/vector-icons';

import * as Location from 'expo-location';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [emergencyType, setEmergencyType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need location access to provide assistance');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const handleEmergencyRequest = (type) => {
    setEmergencyType(type);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('ServiceProviders', { 
        serviceType: type,
        location: location 
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.openDrawer()}>
            <Entypo name="menu" size={28} color="#333" />
          </Pressable>
          <Text style={styles.headerTitle}>Breakdown Assistant</Text>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <FontAwesome name="user-circle" size={24} color="#333" />
          </Pressable>
        </View>

        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Ionicons name="warning" size={28} color="#fff" />
          <Text style={styles.emergencyText}>In Emergency? Tap Below</Text>
        </View>

        {/* Location Map */}
       

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Assistance</Text>
        <View style={styles.quickActions}>
          <Pressable 
            style={[styles.actionButton, styles.emergencyButton]}
            onPress={() => handleEmergencyRequest('emergency')}
            disabled={isLoading}
          >
            <Ionicons name="alert-circle" size={32} color="#fff" />
            <Text style={styles.actionButtonText}>Emergency Help</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, styles.towingButton]}
            onPress={() => handleEmergencyRequest('towing')}
            disabled={isLoading}
          >
            <MaterialIcons name="local-shipping" size={32} color="#fff" />
            <Text style={styles.actionButtonText}>Request Tow Truck</Text>
          </Pressable>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          <Pressable 
            style={styles.serviceCard}
            onPress={() => navigation.navigate('request')}
          >
            <View style={styles.serviceIcon}>
              <MaterialIcons name="handyman" size={28} color="#febe10" />
            </View>
            <Text style={styles.serviceText}>Mobile Mechanic</Text>
          </Pressable>

          <Pressable 
            style={styles.serviceCard}
            onPress={() => navigation.navigate('android')}
          >
            <View style={styles.serviceIcon}>
              <MaterialIcons name="battery-charging-full" size={28} color="#febe10" />
            </View>
            <Text style={styles.serviceText}>Jump Start</Text>
          </Pressable>

          <Pressable 
            style={styles.serviceCard}
            onPress={() => navigation.navigate('trial')}
          >
            <View style={styles.serviceIcon}>
              <MaterialIcons name="local-gas-station" size={28} color="#febe10" />
            </View>
            <Text style={styles.serviceText}>Fuel Delivery</Text>
          </Pressable>

          <Pressable 
            style={styles.serviceCard}
            onPress={() => navigation.navigate('Tire')}
          >
            <View style={styles.serviceIcon}>
              <MaterialIcons name="car-repair" size={28} color="#febe10" />
            </View>
            <Text style={styles.serviceText}>Tire Change</Text>
          </Pressable>
        </View>

        {/* Recent Requests (if any) */}
        <Text style={styles.sectionTitle}>Recent Requests</Text>
        <View style={styles.recentRequest}>
          <Text style={styles.noRequestsText}>No recent requests</Text>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <Text style={styles.loadingTitle}>Finding {emergencyType === 'towing' ? 'Tow Services' : 'Emergency Help'} Near You</Text>
            <Image 
              source={require('../assets/loading.gif')} 
              style={styles.loadingGif}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mapContainer: {
    height: 200,
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  emergencyButton: {
    backgroundColor: '#ff4444',
  },
  towingButton: {
    backgroundColor: '#333',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  recentRequest: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRequestsText: {
    color: '#999',
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingGif: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;