import { StyleSheet, View } from 'react-native'
import React, { useCallback } from 'react'
import LottieView from 'lottie-react-native'
import Animated, { FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

const Splash = () => {
  const navigation = useNavigation()

  useFocusEffect(useCallback(() => {
    setTimeout(() => {
      navigation.navigate('Home' as never)
    }, 2000)
    return () => {
    }
  }, []))

  return (
    <View style={styles.container}>
      <LottieView style={[styles.lottie, StyleSheet.absoluteFillObject]} source={require('../assets/Gray_Seagulls.json')} autoPlay loop />
      
      <View style={styles.textContainer}>
        <Animated.Text 
          style={styles.text} 
          entering={FadeInLeft.duration(800).delay(0)}
        >
          GOOD
        </Animated.Text>
        
        <Animated.Text 
          style={styles.text} 
          entering={FadeInRight.duration(1000).delay(200)}
        >
          MORNING
        </Animated.Text>
      </View>
      
      <Animated.Text 
        style={styles.username} 
        entering={FadeInUp.duration(600).delay(1200)}
      >
        Anurag
      </Animated.Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        fontStyle: 'italic',
    }
})