import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, ScrollView, Alert, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons, FontAwesome, AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';

const MechanicHomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const MechanicPanel = ({ route, navigation }) => {
    useEffect(() => {
      if (route.params?.notification) {
        const { coordinates, token, message } = route.params.notification;
        
        Alert.alert(
          'New Service Request',
          `${message}\n\nLocation: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`,
          [
            {
              text: 'Accept',
              onPress: () => handleAcceptRequest(coordinates, token)
            },
            {
              text: 'View Details',
              onPress: () => navigation.navigate('RequestDetails', { coordinates, token })
            },
            {
              text: 'Dismiss',
              style: 'cancel'
            }
          ],
          { cancelable: false }
        );
      }
    }, [route.params]);
  
    const handleAcceptRequest = (coords, token) => {
      console.log('Accepted request with:', { coords, token });
      // Add your acceptance logic here
    };
  
    // ... rest of your mechanic panel component
  }; 
  // Get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required to receive jobs');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  // Toggle online status
  const toggleOnlineStatus = async () => {
    setIsLoading(true);
    // Simulate API call to update mechanic status
    setTimeout(() => {
      setIsOnline(!isOnline);
      setIsLoading(false);
      Alert.alert(`You are now ${!isOnline ? 'online' : 'offline'}`);
    }, 1000);
  };

  // Mock active jobs data
  const mockJobs = [
    { id: 1, type: 'Towing', customer: 'John D.', distance: '2.5 km', price: '$50' },
    { id: 2, type: 'Jump Start', customer: 'Sarah M.', distance: '1.8 km', price: '$30' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.openDrawer()}>
            <Entypo name="menu" size={28} color="#333" />
          </Pressable>
          <Text style={styles.headerTitle}>Mechanic Dashboard</Text>
          <Pressable onPress={() => navigation.navigate('M_profile')}>
            <FontAwesome name="user-circle" size={24} color="#333" />
          </Pressable>
        </View>

        {/* Online Status Toggle */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Available for Jobs</Text>
          <Switch
            value={isOnline}
            onValueChange={toggleOnlineStatus}
            disabled={isLoading}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isOnline ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Jobs Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$420</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Active Jobs */}
        <Text style={styles.sectionTitle}>Active Jobs</Text>
        {mockJobs.length > 0 ? (
          mockJobs.map((job) => (
            <Pressable 
              key={job.id} 
              style={styles.jobCard}
              onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
            >
              <View style={styles.jobInfo}>
                <MaterialIcons 
                  name={job.type === 'Towing' ? 'local-shipping' : 'battery-charging-full'} 
                  size={24} 
                  color="#febe10" 
                />
                <View style={styles.jobText}>
                  <Text style={styles.jobType}>{job.type}</Text>
                  <Text style={styles.jobCustomer}>{job.customer} • {job.distance}</Text>
                </View>
              </View>
              <Text style={styles.jobPrice}>{job.price}</Text>
            </Pressable>
          ))
        ) : (
          <View style={styles.noJobs}>
            <Text style={styles.noJobsText}>No active jobs</Text>
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Earnings')}
          >
            <MaterialIcons name="attach-money" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Earnings</Text>
          </Pressable>
          <Pressable 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Schedule')}
          >
            <MaterialIcons name="schedule" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Schedule</Text>
          </Pressable>
          <Pressable 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tools')}
          >
            <MaterialIcons name="build" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Tools</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#febe10" />
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobText: {
    marginLeft: 10,
  },
  jobType: {
    fontSize: 16,
    fontWeight: '500',
  },
  jobCustomer: {
    fontSize: 12,
    color: '#666',
  },
  jobPrice: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  noJobs: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  noJobsText: {
    color: '#999',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  actionButton: {
    backgroundColor: '#febe10',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MechanicHomeScreen;