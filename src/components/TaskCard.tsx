import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withSequence,
  withTiming,
  FadeInUp,
  FadeOutDown,
  SlideInRight,
} from 'react-native-reanimated'
import { SVW } from '../utils/Constants'
import { Task, PRIORITY_COLORS, PRIORITY_LABELS } from '../types/task'

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onPress: (task: Task) => void
  onDelete: (id: string) => void
  index: number
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const TaskCard = ({ task, onToggle, onPress, onDelete, index }: TaskCardProps) => {
  const scale = useSharedValue(1)
  const checkScale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: withTiming(task.completed ? 0.7 : 1, { duration: 300 }),
    }
  })

  const checkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
    }
  })

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    )
  }

  const handleToggle = () => {
    checkScale.value = withSequence(
      withSpring(1.3, { damping: 5 }),
      withSpring(1, { damping: 8 })
    )
    onToggle(task.id)
  }

  const priorityColor = PRIORITY_COLORS[task.priority]

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={() => {
        handlePress()
        onPress(task)
      }}
      entering={SlideInRight.duration(400).delay(index * 100).springify()}
      exiting={FadeOutDown.duration(300)}
    >
      {/* Priority indicator bar */}
      <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />
      
      <View style={styles.content}>
        {/* Checkbox and Title */}
        <View style={styles.topRow}>
          <Pressable 
            onPress={handleToggle}
            hitSlop={10}
          >
            <Animated.View 
              style={[
                styles.checkbox, 
                task.completed && styles.checkboxCompleted,
                { borderColor: priorityColor },
                task.completed && { backgroundColor: priorityColor },
                checkAnimatedStyle
              ]}
            >
              {task.completed && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </Animated.View>
          </Pressable>

          <View style={styles.textContainer}>
            <Text 
              style={[
                styles.title,
                task.completed && styles.titleCompleted
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
          </View>
        </View>

        {/* Description */}
        {task.description && (
          <Text 
            style={styles.description}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        {/* Footer with Priority and Delete */}
        <View style={styles.footer}>
          <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}20` }]}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>

          {task.dueDate && (
            <Text style={styles.dueDate}>
              📅 {new Date(task.dueDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          )}

          <Pressable 
            style={styles.deleteButton}
            onPress={() => onDelete(task.id)}
            hitSlop={10}
          >
            <Text style={styles.deleteText}>🗑️</Text>
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  )
}

export default TaskCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: SVW * 0.04,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  priorityBar: {
    width: '100%',
    height: 4,
  },
  content: {
    padding: SVW * 0.04,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SVW * 0.02,
  },
  checkbox: {
    width: SVW * 0.065,
    height: SVW * 0.065,
    borderRadius: SVW * 0.02,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: SVW * 0.03,
  },
  checkboxCompleted: {
    borderColor: '#34C759',
  },
  checkmark: {
    color: 'white',
    fontSize: SVW * 0.045,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: SVW * 0.045,
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: SVW * 0.06,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: SVW * 0.035,
    color: '#666',
    lineHeight: SVW * 0.048,
    marginBottom: SVW * 0.03,
    paddingLeft: SVW * 0.095,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SVW * 0.095,
    gap: SVW * 0.02,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SVW * 0.025,
    paddingVertical: SVW * 0.015,
    borderRadius: 12,
    gap: SVW * 0.015,
  },
  priorityDot: {
    width: SVW * 0.02,
    height: SVW * 0.02,
    borderRadius: SVW * 0.01,
  },
  priorityText: {
    fontSize: SVW * 0.03,
    fontWeight: '600',
  },
  dueDate: {
    fontSize: SVW * 0.03,
    color: '#666',
  },
  deleteButton: {
    marginLeft: 'auto',
    padding: SVW * 0.01,
  },
  deleteText: {
    fontSize: SVW * 0.045,
  },
})

