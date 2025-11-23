import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons, FontAwesome, AntDesign, Fontisto } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userId");
       
        
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://192.168.1.47:8000/profile/${token}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
      } catch (err) {
        setError("Error fetching profile data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "red" }}>{error}</Text>
        <Pressable 
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 24 }} /> {/* Spacer for alignment */}
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <FontAwesome name="user-circle" size={100} color="#febe10" />
          </View>
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* User Details Section */}
        <View style={styles.detailsContainer}>
          {/* Name Field */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <AntDesign name="user" size={20} color="#666" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{user.name}</Text>
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Fontisto name="email" size={20} color="#666" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
          </View>

          {/* Mobile Field */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <AntDesign name="mobile1" size={20} color="#666" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>{user.mobileNo || "Not provided"}</Text>
            </View>
          </View>

          {/* Address Field */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="location-on" size={20} color="#666" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{user.address || "Not provided"}</Text>
            </View>
          </View>

          {/* ID Field */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="assignment-ind" size={20} color="#666" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>ID Number</Text>
              <Text style={styles.value}>{user.idNo || "Not provided"}</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable 
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.removeItem("authToken");
            navigation.replace('Login');
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#febe10',
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#febe10',
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: '#666',
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 3,
  },
  logoutButton: {
    marginTop: 30,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#febe10',
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;