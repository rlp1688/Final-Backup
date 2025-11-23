import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_LENGTH = 250; // Circumference
const R = CIRCLE_LENGTH / (2 * Math.PI);

const FindingMechanicScreen = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const dashOffset = useRef(new Animated.Value(CIRCLE_LENGTH)).current;

  // Infinite rotating animation
  useEffect(() => {
    // Outer circle rotation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    // Dashed circle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dashOffset, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(dashOffset, {
          toValue: CIRCLE_LENGTH,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();

    return () => {
      spinValue.stopAnimation();
      dashOffset.stopAnimation();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Progress Circle */}
        <View style={styles.circleContainer}>
          <Svg width={R*2 + 40} height={R*2 + 40}>
            <Circle
              cx={R + 20}
              cy={R + 20}
              r={R}
              stroke="#f5f5f5"
              strokeWidth={6}
              fill="transparent"
            />
            <AnimatedCircle
              cx={R + 20}
              cy={R + 20}
              r={R}
              stroke="#febe10"
              strokeWidth={6}
              fill="transparent"
              strokeDasharray={50}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </Svg>
          
          {/* Rotating Center Icon */}
          <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }] }]}>
            <MaterialIcons name="car-repair" size={40} color="#febe10" />
          </Animated.View>
        </View>

        <Text style={styles.title}>Searching for Mechanics</Text>
        
        <View style={styles.tipBox}>
          <MaterialIcons name="schedule" size={18} color="#febe10" />
          <Text style={styles.tipText}>
            This usually takes 1-5 minutes...
          </Text>
        </View>

        <Text style={styles.statusText}>
          Scanning nearby locations...
        </Text>
      </View>
    </SafeAreaView>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  circleContainer: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    color: '#333',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default FindingMechanicScreen;