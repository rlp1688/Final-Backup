import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

import trial from '../screens/trial';
import ios from '../screens/ios';
import android from '../screens/android';
import place from '../screens/place';




// Import Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MapScreen from '../screens/MapScreen';
import UserSelect from '../screens/UserSelect';
import MechanicScreen from '../screens/MechanicScreen';
import userLocation from '../screens/UserLocation';
import getlocation from '../screens/getlocation';
import request from '../screens/ClientRequest';
import MechanicLogin from '../screens/MechanicLogin';
import MechanicPanel from '../screens/MechanicPanel';
import MechanicProfile from '../screens/MechanicProfile'
import Search from '../screens/SearchMechanic'
import message from '../screens/message'
import chat from '../screens/MechanicChat'

// Create Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function BottomTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>

            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "",
                    tabBarLabelStyle: { color: "#008e97" },
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <AntDesign name="home" size={24} color="black" />
                        ) : (
                            <AntDesign name="home" size={24} color="black" />
                        ),
                }}
            />
             <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: "",
                    tabBarLabelStyle: { color: "#008e97" },
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <AntDesign name="user" size={24} color="black" />
                        ) : (
                            <AntDesign name="user" size={24} color="black" />
                        ),
                }}
            />

        </Tab.Navigator>
    );
}


const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                
            <Stack.Screen name="User" component={UserSelect} />
            <Stack.Screen name="request" component={request} />
            <Stack.Screen name="place" component={place} />
            
            <Stack.Screen name="Main" component={BottomTabs} />
            <Stack.Screen name="message" component={message} />
            <Stack.Screen name="chat" component={chat} />
          
            <Stack.Screen name="mechanicPanel" component={MechanicPanel} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Mechaniclogin" component={MechanicLogin} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Mechanic" component={MechanicScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Map" component={MapScreen} />
                
                <Stack.Screen name="getlocation" component={getlocation} />
                <Stack.Screen name="M_profile" component={MechanicProfile} />
                <Stack.Screen name="search" component={Search} />
                <Stack.Screen name="trial" component={trial} />
                <Stack.Screen name="ios" component={ios} />
                <Stack.Screen name="android" component={android} />
                <Stack.Screen name="Location" component={userLocation} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;

const styles = StyleSheet.create({});
