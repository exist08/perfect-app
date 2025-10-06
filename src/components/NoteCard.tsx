import { StyleSheet, Text, View, Pressable, Platform } from 'react-native'
import React, { useState } from 'react'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  RotateInDownLeft,
  RotateOutUpRight
} from 'react-native-reanimated'
import { SVW } from '../utils/Constants'
import { Note } from '../types/note'

interface NoteCardProps {
  note: Note
  onPress: (note: Note) => void
  onLongPress: (note: Note) => void
  index: number
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const NoteCard = ({ note, onPress, onLongPress, index }: NoteCardProps) => {
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)
  const [isPressed, setIsPressed] = useState(false)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { perspective: 1000 },
      ],
    }
  })

  const handlePressIn = () => {
    setIsPressed(true)
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 })
    rotation.value = withSpring(2, { damping: 10, stiffness: 100 })
  }

  const handlePressOut = () => {
    setIsPressed(false)
    scale.value = withSpring(1, { damping: 10, stiffness: 200 })
    rotation.value = withSpring(0, { damping: 10, stiffness: 100 })
  }

  // Random slight rotation for natural sticky note effect
  const naturalRotation = (index % 3 - 1) * 2

  return (
    <AnimatedPressable
      style={[
        styles.container,
        { backgroundColor: note.color, transform: [{ rotate: `${naturalRotation}deg` }] },
        animatedStyle,
      ]}
      onPress={() => onPress(note)}
      onLongPress={() => onLongPress(note)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      entering={RotateInDownLeft.duration(500).delay(index * 80).springify()}
      exiting={RotateOutUpRight.duration(300)}
    >
      {/* Sticky tape effect at top */}
      <View style={styles.tape} />
      
      <View style={styles.content}>
        <Text 
          style={styles.title} 
          numberOfLines={2}
        >
          {note.title}
        </Text>
        
        {note.content && (
          <Text 
            style={styles.preview} 
            numberOfLines={4}
          >
            {note.content}
          </Text>
        )}
        
        <Text style={styles.date}>
          {new Date(note.updatedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Shadow/curl effect at bottom */}
      <View style={styles.curl} />
    </AnimatedPressable>
  )
}

export default NoteCard

const styles = StyleSheet.create({
  container: {
    width: (SVW - SVW * 0.15) / 2,
    minHeight: SVW * 0.5,
    borderRadius: 4,
    padding: SVW * 0.04,
    marginBottom: SVW * 0.04,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  tape: {
    position: 'absolute',
    top: -5,
    left: '35%',
    width: '30%',
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: SVW * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: SVW * 0.02,
    fontFamily: Platform.OS === 'ios' ? 'Marker Felt' : 'sans-serif',
  },
  preview: {
    fontSize: SVW * 0.035,
    color: '#555',
    lineHeight: SVW * 0.05,
    marginBottom: SVW * 0.02,
    fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'sans-serif',
  },
  date: {
    fontSize: SVW * 0.03,
    color: '#888',
    marginTop: 'auto',
    fontStyle: 'italic',
  },
  curl: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderBottomWidth: 20,
    borderBottomColor: 'transparent',
    borderLeftWidth: 20,
    borderLeftColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
  },
})

