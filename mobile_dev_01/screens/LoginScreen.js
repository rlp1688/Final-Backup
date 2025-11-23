import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ActivityIndicator } from 'react-native';
import jwtDecode from 'jwt-decode'; // Install with: npm install jwt-decode

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const navigation = useNavigation();

  // Check login status ONCE when component mounts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        
        if (token) {
          // Verify token expiration
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            navigation.replace("Main");
          } else {
            await AsyncStorage.removeItem("authToken"); // Clear expired token
          }
        }
      } catch (err) {
        console.log("Error checking token:", err);
      } finally {
        setLoading(false); // Stop loading regardless of outcome
      }
    };
    checkLoginStatus();
  }, []); // Empty dependency array = runs once on mount

  const handleLogin = () => {
    const user = {
      email: email,
      password: password
    };

    setLoading(true); // Start loading during login attempt
    axios.post("http://192.168.1.47:8000/login", user)
      .then((response) => {
        const token = response.data.token;
        const userId = response.data.userId;

        AsyncStorage.multiSet([
          ["authToken", token],
          ["userId", userId]
        ]);
        navigation.replace("Main");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid email or password");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View>
        <Image 
          style={{ width: 150, height: 100 }}
          source={require("../images/logo.jpg")}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Login to your account</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <AntDesign style={{ marginLeft: 8 }} name="user" size={24} color="black" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{ marginVertical: 10, width: 300 }} 
              placeholder='Enter your email' 
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <AntDesign style={{ marginLeft: 8 }} name="lock1" size={24} color="black" />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{ marginVertical: 10, width: 300 }} 
              placeholder='Enter your password' 
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text>Don't have an account? Sign up here</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogin}
          style={{ marginTop: 30, alignItems: 'center', backgroundColor: '#febe10', width: 200, borderRadius: 6, padding: 15, marginLeft: 'auto', marginRight: 'auto' }}
          disabled={loading} // Disable button during loading
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: "bold" }}>Login</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});