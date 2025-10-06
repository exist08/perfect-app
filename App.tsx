import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from './src/screens/Home'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from './src/screens/Splash'
import Todos from './src/screens/Todos'
import Tasks from './src/screens/Tasks'
import Notes from './src/screens/Notes'
import UpcomingEvents from './src/screens/UpcomingEvents'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade', animationMatchesGesture: true }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Todos" component={Todos} />
        <Stack.Screen name="Tasks" component={Tasks} />
        <Stack.Screen name="Notes" component={Notes} />
        <Stack.Screen name="UpcomingEvents" component={UpcomingEvents} />
      </Stack.Navigator>  
    </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({})