import { StyleSheet, Text, View, SafeAreaView, Image, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

const RegistrationSelectionScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
      <View>
        <Image style={{ width: 150, height: 100 }} source={require('../images/logo.jpg')} />
      </View>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Choose Your Registration Type</Text>
      </View>

      <View style={{ marginTop: 30 }}>
        <Pressable
          onPress={() => navigation.navigate('Mechanic')}
          style={styles.button}
        >
          <AntDesign name="tool" size={24} color="white" style={{marginRight: 5}} />
          <Text style={styles.buttonText}>Mechanic Registration</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 20 }}>
        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
        >
          <AntDesign name="user" size={24} color="white" style={{marginLeft: -30}} />
          <Text style={styles.buttonText}>Client Registration</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 30 }}>
        <Pressable
          onPress={() => navigation.navigate('message')}
          style={styles.button}
        >
          <AntDesign name="tool" size={24} color="white" style={{marginRight: 5}} />
          <Text style={styles.buttonText}>message</Text>
        </Pressable>
      </View>


      <View style={{ marginTop: 30 }}>
        <Pressable
          onPress={() => navigation.navigate('chat')}
          style={styles.button}
        >
          <AntDesign name="tool" size={24} color="white" style={{marginRight: 5}} />
          <Text style={styles.buttonText}> chat</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );
};

export default RegistrationSelectionScreen;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#febe10',
    width: 250,
    borderRadius: 6,
    padding: 15,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
 
});
