import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, Pressable, TextInput, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from "@react-navigation/native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import axios from "axios"; 

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [idNo, setIdNo] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState("Select Location");
  const navigation = useNavigation();
  const route = useRoute();
  

  // Handle location coordinates when received from the location screen
  useEffect(() => {
    if (route.params?.coordinates) {
      const { lat, lng } = route.params.coordinates;
      setLocation(route.params.coordinates);
      setLocationText(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  }, [route.params]);

  const handleRegister = () => {
    if (!location) {
      Alert.alert("Error", "Please select your location");
      return;
    }

    const user = {
      location: {
        type: "Point",
        coordinates: [
          location?.longitude || 0,  // longitude first
          location?.latitude || 0    // latitude second
        ]
      },

      name: name,
      email: email,
      address: address,
      idNo: idNo,
      mobileNo: mobileNo,
      password: password,
      // Includes both lat and lng
    };

    axios.post("http://172.20.10.3:8000/mechanic_register", user)
      .then((response) => {
        console.log(response);
        Alert.alert("Registration successful");
        setName("");
        setEmail("");
        setPassword("");
        setAddress("");
        setIdNo("");
        setMobileNo("");
        setLocation(null);
        setLocationText("Select Location");

        navigation.navigate("Mechaniclogin")
      })
      .catch((error) => {
        Alert.alert("Error", "Registration failed");
        console.log("error", error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View>
        <Image style={{ width: 150, height: 100 }}
          source={require("../images/logo.jpg")}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Mechanic Register</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <AntDesign style={{ marginLeft: 8 }} name="enviromento" size={24} color="black" />
            <TouchableOpacity
              onPress={() => navigation.navigate('place')}
              style={{ paddingVertical: 10, width: 300 }}
            >
              <Text style={{ color: 'black', fontSize: 14 }}>{locationText}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <AntDesign style={{ marginLeft: 8 }} name="adduser" size={24} color="black" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{ marginVertical: 10, width: 300 }}
              placeholder='enter your name'
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <AntDesign style={{ marginLeft: 8 }} name="enviroment" size={24} color="black" />
            <TextInput
              value={address}
              onChangeText={(text) => setAddress(text)}
              style={{ marginVertical: 10, width: 300 }}
              placeholder='enter your address'
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <AntDesign style={{ marginLeft: 8 }} name="idcard" size={24} color="black" />
            <TextInput
              value={idNo}
              onChangeText={(text) => setIdNo(text)}
              style={{ marginVertical: 10, width: 300 }}
              placeholder='enter your Id no'
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <Fontisto style={{ marginLeft: 8 }} name="email" size={24} color="black" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{ marginVertical: 10, width: 300 }}
              placeholder='enter your email'
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 20 }}>
            <AntDesign style={{ marginLeft: 8 }} name="mobile1" size={24} color="black" />
            <TextInput
              value={mobileNo}
              onChangeText={(text) => setMobileNo(text)}
              style={{ marginVertical: 10, width: 300 }}
              placeholder='enter your mobile no'
              keyboardType="phone-pad"
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
              placeholder='enter your password'
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Pressable onPress={() => navigation.navigate('Mechaniclogin')}>
            <Text>Already have an account. login here</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleRegister}
          style={{ marginTop: 30, alignItems: 'center', backgroundColor: '#febe10', width: 200, borderRadius: 6, padding: 15, marginLeft: 'auto', marginRight: 'auto' }}>
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: "bold" }}>Sign Up</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RegisterScreen;

const styles = StyleSheet.create({});