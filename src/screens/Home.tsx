import { StyleSheet, Text, View, Button, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Animated, { BounceInDown, Easing, FadeInDown, FadeInUp, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { SVW } from '../utils/Constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Home = () => {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('UpcomingEvents' as never)
        }, 3000)
    }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
        <LottieView style={StyleSheet.absoluteFillObject} resizeMode='cover' source={require('../assets/Background_Full_Screen.json')} autoPlay loop />
        <Animated.View style={styles.timeNweatherContainer} entering={BounceInDown.duration(500).delay(0).easing(Easing.bounce)}>
            <Animated.View style={styles.timeContainer}>
                <Animated.Text style={styles.time} adjustsFontSizeToFit={true} numberOfLines={1}>10:00 AM</Animated.Text>
            </Animated.View>
            <Animated.View style={styles.weatherContainer}>
                <Animated.Text style={styles.weather}>24°C</Animated.Text>
            </Animated.View>
        </Animated.View>
        <Animated.View style={[ styles.timeNweatherContainer, styles.todosContainer]} entering={BounceInDown.duration(500).delay(300)}>
            <Animated.Text style={styles.todos}>Add a new todo</Animated.Text>
        </Animated.View>
        <Animated.View style={styles.taskNnotesContainer}>
            <Animated.View style={styles.tasksContainer} entering={BounceInDown.duration(500).delay(700).easing(Easing.bounce)}>
                <Animated.Text style={styles.tasks}>TASKS</Animated.Text>
            </Animated.View>
            <Animated.View style={styles.notesContainer} entering={BounceInDown.duration(500).delay(900).easing(Easing.bounce)}>
                <Animated.Text style={styles.notes}>NOTES</Animated.Text>
            </Animated.View>
        </Animated.View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: SVW * 0.05,
        gap: SVW * 0.025,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    timeNweatherContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: SVW * 0.025,
    },
    timeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    time:{
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    weather:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    todosContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: SVW * 0.025,
    },
    todos:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    taskNnotesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: SVW * 0.025,
    },
    tasksContainer: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: SVW * 0.025,
    },
    notesContainer: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: SVW * 0.025,
    },
    tasks:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    notes:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    }

})