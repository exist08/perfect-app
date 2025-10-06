import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  interpolate,
  Extrapolate,
  FadeInRight,
  FadeOutLeft,
  ZoomIn,
} from 'react-native-reanimated'
import { SVW } from '../utils/Constants'
import { Event, EVENT_CATEGORIES } from '../types/event'

interface EventCardProps {
  event: Event
  onPress: (event: Event) => void
  onToggleReminder: (id: string) => void
  onDelete: (id: string) => void
  index: number
  isUpcoming: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const EventCard = ({ event, onPress, onToggleReminder, onDelete, index, isUpcoming }: EventCardProps) => {
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotation.value}deg` },
      ],
    }
  })

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 })
    rotation.value = withSpring(-1, { damping: 15 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 })
    rotation.value = withSpring(0, { damping: 15 })
  }

  const categoryInfo = EVENT_CATEGORIES[event.category]
  
  // Parse date and time
  const eventDate = new Date(event.date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  let dateLabel = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: eventDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
  
  if (eventDate.toDateString() === today.toDateString()) {
    dateLabel = 'Today'
  } else if (eventDate.toDateString() === tomorrow.toDateString()) {
    dateLabel = 'Tomorrow'
  }

  const isPast = eventDate < today && eventDate.toDateString() !== today.toDateString()

  return (
    <View style={styles.timelineContainer}>
      {/* Timeline dot and line */}
      <View style={styles.timelineLeft}>
        <Animated.View 
          style={[
            styles.timelineDot, 
            { backgroundColor: categoryInfo.color },
            isUpcoming && styles.timelineDotUpcoming
          ]}
          entering={ZoomIn.duration(400).delay(index * 80)}
        />
        {index !== 0 && <View style={[styles.timelineLine, { backgroundColor: categoryInfo.color }]} />}
      </View>

      {/* Event Card */}
      <AnimatedPressable
        style={[
          styles.card,
          animatedStyle,
          { borderLeftColor: categoryInfo.color },
          isPast && styles.cardPast
        ]}
        onPress={() => onPress(event)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        entering={FadeInRight.duration(500).delay(index * 100).springify()}
        exiting={FadeOutLeft.duration(300)}
      >
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: `${categoryInfo.color}20` }]}>
          <Text style={styles.categoryEmoji}>{categoryInfo.emoji}</Text>
          <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
            {categoryInfo.label}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, isPast && styles.textPast]} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Description */}
        {event.description && (
          <Text style={[styles.description, isPast && styles.textPast]} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {/* Date and Time Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>📅</Text>
            <Text style={[styles.infoText, isPast && styles.textPast]}>{dateLabel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>🕐</Text>
            <Text style={[styles.infoText, isPast && styles.textPast]}>{event.time}</Text>
          </View>
        </View>

        {/* Location */}
        {event.location && (
          <View style={styles.locationRow}>
            <Text style={styles.infoEmoji}>📍</Text>
            <Text style={[styles.locationText, isPast && styles.textPast]} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}

        {/* Actions Row */}
        <View style={styles.actionsRow}>
          <Pressable 
            style={[styles.reminderButton, event.reminderSet && styles.reminderButtonActive]}
            onPress={() => onToggleReminder(event.id)}
            hitSlop={10}
          >
            <Text style={styles.reminderEmoji}>{event.reminderSet ? '🔔' : '🔕'}</Text>
            <Text style={[
              styles.reminderText,
              event.reminderSet && styles.reminderTextActive
            ]}>
              {event.reminderSet ? 'Reminder On' : 'Set Reminder'}
            </Text>
          </Pressable>

          <Pressable 
            style={styles.deleteButton}
            onPress={() => onDelete(event.id)}
            hitSlop={10}
          >
            <Text style={styles.deleteEmoji}>🗑️</Text>
          </Pressable>
        </View>

        {/* Upcoming indicator */}
        {isUpcoming && (
          <Animated.View 
            style={[styles.upcomingBadge, { backgroundColor: categoryInfo.color }]}
            entering={ZoomIn.duration(300).delay(index * 100 + 200)}
          >
            <Text style={styles.upcomingText}>⚡ Next Up</Text>
          </Animated.View>
        )}
      </AnimatedPressable>
    </View>
  )
}

export default EventCard

const styles = StyleSheet.create({
  timelineContainer: {
    flexDirection: 'row',
    marginBottom: SVW * 0.04,
  },
  timelineLeft: {
    width: SVW * 0.08,
    alignItems: 'center',
    position: 'relative',
  },
  timelineDot: {
    width: SVW * 0.04,
    height: SVW * 0.04,
    borderRadius: SVW * 0.02,
    zIndex: 2,
    borderWidth: 3,
    borderColor: 'white',
  },
  timelineDotUpcoming: {
    width: SVW * 0.06,
    height: SVW * 0.06,
    borderRadius: SVW * 0.03,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  timelineLine: {
    position: 'absolute',
    top: SVW * 0.04,
    width: 2,
    height: '100%',
    opacity: 0.3,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: SVW * 0.04,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'visible',
  },
  cardPast: {
    opacity: 0.6,
    backgroundColor: '#F8F8F8',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SVW * 0.025,
    paddingVertical: SVW * 0.015,
    borderRadius: 12,
    marginBottom: SVW * 0.02,
    gap: SVW * 0.015,
  },
  categoryEmoji: {
    fontSize: SVW * 0.04,
  },
  categoryText: {
    fontSize: SVW * 0.03,
    fontWeight: '600',
  },
  title: {
    fontSize: SVW * 0.045,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: SVW * 0.015,
  },
  description: {
    fontSize: SVW * 0.035,
    color: '#666',
    lineHeight: SVW * 0.05,
    marginBottom: SVW * 0.02,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SVW * 0.04,
    marginBottom: SVW * 0.02,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SVW * 0.015,
  },
  infoEmoji: {
    fontSize: SVW * 0.035,
  },
  infoText: {
    fontSize: SVW * 0.035,
    color: '#333',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SVW * 0.015,
    marginBottom: SVW * 0.02,
  },
  locationText: {
    flex: 1,
    fontSize: SVW * 0.035,
    color: '#666',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SVW * 0.01,
    paddingTop: SVW * 0.02,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SVW * 0.03,
    paddingVertical: SVW * 0.02,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    gap: SVW * 0.015,
  },
  reminderButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  reminderEmoji: {
    fontSize: SVW * 0.04,
  },
  reminderText: {
    fontSize: SVW * 0.03,
    color: '#666',
    fontWeight: '500',
  },
  reminderTextActive: {
    color: '#34C759',
    fontWeight: '600',
  },
  deleteButton: {
    padding: SVW * 0.02,
  },
  deleteEmoji: {
    fontSize: SVW * 0.045,
  },
  textPast: {
    color: '#999',
  },
  upcomingBadge: {
    position: 'absolute',
    top: -SVW * 0.02,
    right: SVW * 0.04,
    paddingHorizontal: SVW * 0.03,
    paddingVertical: SVW * 0.015,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  upcomingText: {
    fontSize: SVW * 0.03,
    fontWeight: '700',
    color: 'white',
  },
})
