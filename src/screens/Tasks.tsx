import { StyleSheet, Text, View, Pressable, FlatList, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SVW } from '../utils/Constants'
import TaskCard from '../components/TaskCard'
import { Task, PRIORITY_COLORS, PRIORITY_LABELS } from '../types/task'
import { MMKV } from 'react-native-mmkv'
import Animated, { FadeInDown, FadeIn, FadeOut, BounceIn } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'

const storage = new MMKV()
const TASKS_KEY = 'tasks'

type FilterType = 'all' | 'active' | 'completed'
type PriorityFilter = 'all' | 'low' | 'medium' | 'high'

const Tasks = () => {
  const insets = useSafeAreaInsets()
  const [tasks, setTasks] = useState<Task[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<FilterType>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')

  // Load tasks from MMKV on mount
  useEffect(() => {
    const storedTasks = storage.getString(TASKS_KEY)
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save tasks to MMKV whenever they change
  useEffect(() => {
    storage.set(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks])

  const openNewTaskModal = () => {
    setEditingTask(null)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setModalVisible(true)
  }

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setModalVisible(true)
  }

  const saveTask = () => {
    if (title.trim() === '') return

    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, title: title.trim(), description: description.trim(), priority }
          : task
      ))
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        priority,
        completed: false,
        createdAt: Date.now(),
      }
      setTasks([newTask, ...tasks])
    }

    setModalVisible(false)
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
    if (editingTask?.id === id) {
      setModalVisible(false)
    }
  }

  // Filter tasks based on status and priority
  const filteredTasks = tasks.filter(task => {
    const statusMatch = 
      filter === 'all' ? true :
      filter === 'active' ? !task.completed :
      task.completed

    const priorityMatch = 
      priorityFilter === 'all' ? true : task.priority === priorityFilter

    return statusMatch && priorityMatch
  })

  // Sort by priority (high -> medium -> low) then by date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return b.createdAt - a.createdAt
  })

  const activeCount = tasks.filter(t => !t.completed).length
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && !t.completed).length

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

      {/* Header with Stats */}
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(500).delay(0)}
      >
        <Text style={styles.headerTitle}>⚡ Tasks</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[styles.statCard, styles.statCardDanger]}>
            <Text style={styles.statNumber}>{highPriorityCount}</Text>
            <Text style={styles.statLabel}>High Priority</Text>
          </View>
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View 
        style={styles.filterContainer}
        entering={FadeInDown.duration(500).delay(200)}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <Pressable
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
          <View style={styles.filterDivider} />
          {(['all', 'high', 'medium', 'low'] as PriorityFilter[]).map((p) => (
            <Pressable
              key={p}
              style={[
                styles.filterTab, 
                priorityFilter === p && styles.filterTabActive,
                p !== 'all' && { backgroundColor: `${PRIORITY_COLORS[p as 'low' | 'medium' | 'high']}30` }
              ]}
              onPress={() => setPriorityFilter(p)}
            >
              <Text style={[
                styles.filterText, 
                priorityFilter === p && styles.filterTextActive,
                p !== 'all' && { color: PRIORITY_COLORS[p as 'low' | 'medium' | 'high'] }
              ]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Tasks List */}
      <View style={styles.listContainer}>
        {sortedTasks.length === 0 ? (
          <Animated.View 
            style={styles.emptyContainer}
            entering={FadeIn.duration(500).delay(400)}
          >
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyText}>No tasks found!</Text>
            <Text style={styles.emptySubtext}>
              {filter !== 'all' || priorityFilter !== 'all' 
                ? 'Try changing your filters' 
                : 'Create your first task'}
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={sortedTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TaskCard
                task={item}
                onToggle={toggleTask}
                onPress={openEditTaskModal}
                onDelete={deleteTask}
                index={index}
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
          onPress={openNewTaskModal}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </Animated.View>

      {/* Task Editor Modal */}
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
            <Text style={styles.modalTitle}>{editingTask ? 'Edit Task' : 'New Task'}</Text>
            <Pressable onPress={saveTask}>
              <Text style={styles.modalSave}>Save</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Title Input */}
            <Text style={styles.inputLabel}>Task Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What needs to be done?"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description Input */}
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add details..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Priority Selector */}
            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.prioritySelector}>
              {(['low', 'medium', 'high'] as const).map((p) => (
                <Pressable
                  key={p}
                  style={[
                    styles.priorityOption,
                    { borderColor: PRIORITY_COLORS[p] },
                    priority === p && { backgroundColor: PRIORITY_COLORS[p] }
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[
                    styles.priorityOptionText,
                    { color: priority === p ? 'white' : PRIORITY_COLORS[p] }
                  ]}>
                    {PRIORITY_LABELS[p]}
                  </Text>
                </Pressable>
              ))}
    </View>
          </ScrollView>

          {/* Delete Button for editing mode */}
          {editingTask && (
            <Pressable 
              style={styles.deleteTaskButton}
              onPress={() => deleteTask(editingTask.id)}
            >
              <Text style={styles.deleteTaskText}>🗑️ Delete Task</Text>
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default Tasks

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
  statCardDanger: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
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
  filterContainer: {
    marginBottom: SVW * 0.03,
  },
  filterScroll: {
    paddingHorizontal: SVW * 0.05,
    gap: SVW * 0.02,
  },
  filterTab: {
    paddingHorizontal: SVW * 0.04,
    paddingVertical: SVW * 0.025,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterTabActive: {
    backgroundColor: 'white',
  },
  filterText: {
    fontSize: SVW * 0.035,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  filterTextActive: {
    color: '#007AFF',
  },
  filterDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: SVW * 0.02,
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
    backgroundColor: '#007AFF',
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
    color: '#007AFF',
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
  titleInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: SVW * 0.04,
    fontSize: SVW * 0.04,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  descriptionInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: SVW * 0.04,
    fontSize: SVW * 0.04,
    color: '#333',
    minHeight: SVW * 0.3,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: SVW * 0.03,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: SVW * 0.035,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  priorityOptionText: {
    fontSize: SVW * 0.04,
    fontWeight: '600',
  },
  deleteTaskButton: {
    margin: SVW * 0.05,
    padding: SVW * 0.04,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteTaskText: {
    color: 'white',
    fontSize: SVW * 0.04,
    fontWeight: 'bold',
  },
})
