import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  FlatList, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SVW } from '../utils/Constants'
import { Event, EVENT_CATEGORIES, EventCategory } from '../types/event'
import { MMKV } from 'react-native-mmkv'
import Animated, { FadeInDown, FadeIn, BounceIn, ZoomIn } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import EventCard from '../components/EventCard'
import { useMMKVStorage } from '../store/mmkvStorage'

const EVENTS_KEY = 'events'

const UpcomingEvents = () => {
  const insets = useSafeAreaInsets()
  const [events, setEvents, removeEvents] = useMMKVStorage(EVENTS_KEY, [])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState<EventCategory>('personal')


  const openNewEventModal = () => {
    setEditingEvent(null)
    setTitle('')
    setDescription('')
    
    // Set default date to today
    const today = new Date()
    setDate(today.toISOString().split('T')[0])
    setTime('12:00')
    setLocation('')
    setCategory('personal')
    setModalVisible(true)
  }

  const openEditEventModal = (event: Event) => {
    setEditingEvent(event)
    setTitle(event.title)
    setDescription(event.description)
    setDate(event.date)
    setTime(event.time)
    setLocation(event.location || '')
    setCategory(event.category)
    setModalVisible(true)
  }

  const saveEvent = () => {
    if (title.trim() === '' || date === '' || time === '') return

    const categoryInfo = EVENT_CATEGORIES[category]

    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { 
              ...event, 
              title: title.trim(), 
              description: description.trim(),
              date,
              time,
              location: location.trim(),
              category,
              color: categoryInfo.color
            }
          : event
      ))
    } else {
      // Create new event
      const newEvent: Event = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        date,
        time,
        location: location.trim(),
        category,
        color: categoryInfo.color,
        reminderSet: false,
        createdAt: Date.now(),
      }
      setEvents([...events, newEvent])
    }

    setModalVisible(false)
  }

  const toggleReminder = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, reminderSet: !event.reminderSet } : event
    ))
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id))
    if (editingEvent?.id === id) {
      setModalVisible(false)
    }
  }

  // Sort events by date and time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  // Find the next upcoming event
  const now = new Date()
  const upcomingEventIndex = sortedEvents.findIndex(event => {
    const eventDateTime = new Date(`${event.date}T${event.time}`)
    return eventDateTime >= now
  })

  // Split into upcoming and past events
  const upcomingEvents = upcomingEventIndex >= 0 ? sortedEvents.slice(upcomingEventIndex) : []
  const pastEvents = upcomingEventIndex > 0 ? sortedEvents.slice(0, upcomingEventIndex) : []

  const allSortedEvents = [...upcomingEvents, ...pastEvents]

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LottieView 
        style={StyleSheet.absoluteFillObject} 
        resizeMode='cover' 
        source={require('../assets/Background_Full_Screen.json')} 
        autoPlay 
        loop 
      />

      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(500).delay(0)}
      >
        <Text style={styles.headerTitle}>📅 Events</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {events.filter(e => e.reminderSet).length}
            </Text>
            <Text style={styles.statLabel}>Reminders</Text>
          </View>
        </View>
      </Animated.View>

      {/* Events List */}
      <View style={styles.listContainer}>
        {events.length === 0 ? (
          <Animated.View 
            style={styles.emptyContainer}
            entering={FadeIn.duration(500).delay(300)}
          >
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No events scheduled!</Text>
            <Text style={styles.emptySubtext}>Tap the + button to create your first event</Text>
          </Animated.View>
        ) : (
          <FlatList
            data={allSortedEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <EventCard
                event={item}
                onPress={openEditEventModal}
                onToggleReminder={toggleReminder}
                onDelete={deleteEvent}
                index={index}
                isUpcoming={index === 0 && upcomingEvents.length > 0}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Add Button */}
      <Animated.View
        style={styles.fabContainer}
        entering={BounceIn.duration(500).delay(400)}
      >
        <Pressable 
          style={styles.fab}
          onPress={openNewEventModal}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </Animated.View>

      {/* Event Editor Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Edit Event' : 'New Event'}
            </Text>
            <Pressable onPress={saveEvent}>
              <Text style={styles.modalSave}>Save</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Title Input */}
            <Text style={styles.inputLabel}>Event Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="What's the event?"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description Input */}
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Date and Time Row */}
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.inputLabel}>Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                  value={date}
                  onChangeText={setDate}
                />
              </View>
              <View style={styles.dateTimeItem}>
                <Text style={styles.inputLabel}>Time *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  placeholderTextColor="#999"
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>

            {/* Location Input */}
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Where is it?"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />

            {/* Category Selector */}
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categorySelector}>
              {(Object.keys(EVENT_CATEGORIES) as EventCategory[]).map((cat) => {
                const catInfo = EVENT_CATEGORIES[cat]
                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryOption,
                      { borderColor: catInfo.color },
                      category === cat && { backgroundColor: catInfo.color }
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={styles.categoryOptionEmoji}>{catInfo.emoji}</Text>
                    <Text style={[
                      styles.categoryOptionText,
                      { color: category === cat ? 'white' : catInfo.color }
                    ]}>
                      {catInfo.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </ScrollView>

          {/* Delete Button for editing mode */}
          {editingEvent && (
            <Pressable 
              style={styles.deleteEventButton}
              onPress={() => deleteEvent(editingEvent.id)}
            >
              <Text style={styles.deleteEventText}>🗑️ Delete Event</Text>
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default UpcomingEvents

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SVW * 0.05,
    paddingTop: SVW * 0.05,
    paddingBottom: SVW * 0.03,
  },
  headerTitle: {
    fontSize: SVW * 0.08,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SVW * 0.03,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SVW * 0.03,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: SVW * 0.04,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SVW * 0.08,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: SVW * 0.03,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: SVW * 0.01,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: SVW * 0.05,
  },
  listContent: {
    paddingBottom: SVW * 0.1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SVW * 0.2,
  },
  emptyEmoji: {
    fontSize: SVW * 0.2,
    marginBottom: SVW * 0.05,
  },
  emptyText: {
    fontSize: SVW * 0.06,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SVW * 0.02,
  },
  emptySubtext: {
    fontSize: SVW * 0.04,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    paddingHorizontal: SVW * 0.1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: SVW * 0.08,
    right: SVW * 0.05,
  },
  fab: {
    width: SVW * 0.15,
    height: SVW * 0.15,
    borderRadius: SVW * 0.075,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: SVW * 0.1,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SVW * 0.05,
    paddingBottom: SVW * 0.03,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: SVW * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCancel: {
    fontSize: SVW * 0.04,
    color: '#666',
  },
  modalSave: {
    fontSize: SVW * 0.04,
    fontWeight: 'bold',
    color: '#5856D6',
  },
  modalContent: {
    flex: 1,
    padding: SVW * 0.05,
  },
  inputLabel: {
    fontSize: SVW * 0.04,
    fontWeight: '600',
    color: '#333',
    marginBottom: SVW * 0.02,
    marginTop: SVW * 0.03,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: SVW * 0.04,
    fontSize: SVW * 0.04,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    minHeight: SVW * 0.25,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: SVW * 0.03,
  },
  dateTimeItem: {
    flex: 1,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SVW * 0.03,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SVW * 0.04,
    paddingVertical: SVW * 0.025,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: 'white',
    gap: SVW * 0.02,
  },
  categoryOptionEmoji: {
    fontSize: SVW * 0.045,
  },
  categoryOptionText: {
    fontSize: SVW * 0.035,
    fontWeight: '600',
  },
  deleteEventButton: {
    margin: SVW * 0.05,
    padding: SVW * 0.04,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteEventText: {
    color: 'white',
    fontSize: SVW * 0.04,
    fontWeight: 'bold',
  },
})
