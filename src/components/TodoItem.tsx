import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import Animated, { FadeInRight, FadeOutLeft, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
import { SVW } from '../utils/Constants'
import { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  index: number
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const TodoItem = ({ todo, onToggle, onDelete, index }: TodoItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(todo.completed ? 0.6 : 1, { duration: 300 }),
      transform: [
        { scale: withSpring(todo.completed ? 0.98 : 1) }
      ]
    }
  })

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={() => onToggle(todo.id)}
      entering={FadeInRight.duration(400).delay(index * 100)}
      exiting={FadeOutLeft.duration(300)}
    >
      <View style={styles.contentContainer}>
        {/* Checkbox */}
        <View style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}>
          {todo.completed && (
            <Animated.Text style={styles.checkmark}>✓</Animated.Text>
          )}
        </View>

        {/* Todo Text */}
        <Text 
          style={[
            styles.title, 
            todo.completed && styles.titleCompleted
          ]}
          numberOfLines={2}
        >
          {todo.title}
        </Text>
      </View>

      {/* Delete Button */}
      <Pressable 
        style={styles.deleteButton}
        onPress={() => onDelete(todo.id)}
        hitSlop={10}
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </AnimatedPressable>
  )
}

export default TodoItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: SVW * 0.04,
    marginBottom: SVW * 0.03,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SVW * 0.03,
  },
  checkbox: {
    width: SVW * 0.06,
    height: SVW * 0.06,
    borderRadius: SVW * 0.015,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: SVW * 0.04,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: SVW * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    width: SVW * 0.08,
    height: SVW * 0.08,
    borderRadius: SVW * 0.04,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SVW * 0.02,
  },
  deleteText: {
    color: 'white',
    fontSize: SVW * 0.045,
    fontWeight: 'bold',
  },
})

