import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, Pressable, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import axios from "axios";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [idNo, setIdNo] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      address: address,
      idNo: idNo,
      mobileNo: mobileNo,
      email: email,
      password: password,
    
    };

    axios.post("http://172.20.10.3:8000/register", user)
      .then((response) => {
       
        Alert.alert("Registration Successful");
        setName("");
        setAddress("");
        setIdNo("");
        setMobileNo("");
        setEmail("");
        setPassword("");

        navigation.navigate("Login")
      })
      .catch((error) => {
        Alert.alert("Registration Failed", error.response?.data?.message || "An error occurred");
        console.log("Error:", error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View>
        <Image
          style={{ width: 150, height: 100 }}
          source={require("../images/logo.jpg")}
        />
      </View>

      <KeyboardAvoidingView behavior="padding" style={{ width: "100%", alignItems: "center" }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 12 }}>Client Register</Text>
        </View>

        {/* Name Input */}
        <View style={{ marginTop: 10, }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <AntDesign style={{ marginLeft: 8 }} name="user" size={24} color="black" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{ marginVertical: 10, width: 300 }}
              placeholder='Enter your name'
            />
          </View>
        </View>

        {/* Address Input */}
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <MaterialIcons style={{ marginLeft: 8 }} name="location-on" size={24} color="black" />
            <TextInput
              value={address}
              onChangeText={(text) => setAddress(text)}
              style={{ marginVertical: 10, width: 300 }}
              placeholder='Enter your address'
            />
          </View>
        </View>

        {/* ID No Input */}
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <MaterialIcons style={{ marginLeft: 8 }} name="assignment-ind" size={24} color="black" />
            <TextInput
              value={idNo}
              onChangeText={(text) => setIdNo(text)}
              style={{ marginVertical: 10, width: 300 }}
              placeholder='Enter your ID no'
            />
          </View>
        </View>

        {/* Mobile No Input */}
        <View style={{ marginTop: 10, }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <MaterialIcons style={{ marginLeft: 8 }} name="phone" size={24} color="black" />
            <TextInput
              value={mobileNo}
              onChangeText={(text) => setMobileNo(text)}
              keyboardType="phone-pad"
              style={{ marginVertical: 10, width: 300 }}
              placeholder='Enter your mobile no'
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <Fontisto style={{ marginLeft: 8 }} name="email" size={24} color="black" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              style={{ marginVertical: 10, width: 300 }}
              placeholder='Enter your email'
            />
          </View>
        </View>

        {/* Password Input */}
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

        {/* Login Redirect */}
        <View style={{ marginTop: 10 }}>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={{ textAlign: 'center', color: 'gray' }}>Already have an account? Login here</Text>
          </Pressable>
        </View>

        {/* Sign Up Button */}
        <Pressable
          onPress={handleRegister}
          style={{ marginTop: 30, alignItems: 'center', backgroundColor: '#febe10', width: 200, borderRadius: 6, padding: 15 }}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: "bold" }}>Sign Up</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});