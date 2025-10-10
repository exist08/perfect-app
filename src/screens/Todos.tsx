import { StyleSheet, Text, View, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SVW } from '../utils/Constants'
import TodoItem from '../components/TodoItem'
import { Todo } from '../types/todo'
import { MMKV } from 'react-native-mmkv'
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'

const storage = new MMKV()
const TODOS_KEY = 'todos'

const Todos = () => {
  const insets = useSafeAreaInsets()
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputText, setInputText] = useState('')

  // Load todos from MMKV on mount
  useEffect(() => {
    const storedTodos = storage.getString(TODOS_KEY)
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  // Save todos to MMKV whenever they change
  useEffect(() => {
    storage.set(TODOS_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputText.trim() === '') return

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: inputText.trim(),
      completed: false,
      createdAt: Date.now(),
    }

    setTodos([newTodo, ...todos])
    setInputText('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const activeTodos = todos.filter(todo => !todo.completed).length
  const completedTodos = todos.filter(todo => todo.completed).length

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
        <Text style={styles.headerTitle}>My Todos</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activeTodos}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedTodos}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
      </Animated.View>

      {/* Input Area */}
      <Animated.View 
        style={styles.inputContainer}
        entering={FadeInDown.duration(500).delay(200)}
      >
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
        <Pressable 
          style={[styles.addButton, inputText.trim() === '' && styles.addButtonDisabled]}
          onPress={addTodo}
          disabled={inputText.trim() === ''}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </Animated.View>

      {/* Todos List */}
      <View style={styles.listContainer}>
        {todos.length === 0 ? (
          <Animated.View 
            style={styles.emptyContainer}
            entering={FadeInUp.duration(500).delay(400)}
          >
            <Text style={styles.emptyText}>No todos yet!</Text>
            <Text style={styles.emptySubtext}>Add your first task above</Text>
          </Animated.View>
        ) : (
          <Animated.FlatList
          layout={LinearTransition}
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TodoItem
                todo={item}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                index={index}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Clear Completed Button */}
      {completedTodos > 0 && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={styles.clearButtonContainer}
        >
          <Pressable 
            style={styles.clearButton}
            onPress={clearCompleted}
          >
            <Text style={styles.clearButtonText}>
              Clear {completedTodos} Completed
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  )
}

export default Todos

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SVW * 0.05,
  },
  header: {
    marginTop: SVW * 0.05,
    marginBottom: SVW * 0.05,
  },
  headerTitle: {
    fontSize: SVW * 0.08,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SVW * 0.03,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: SVW * 0.04,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: SVW * 0.08,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: SVW * 0.035,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SVW * 0.01,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: SVW * 0.03,
    marginBottom: SVW * 0.04,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: SVW * 0.04,
    color: '#333',
    paddingVertical: SVW * 0.02,
  },
  addButton: {
    width: SVW * 0.12,
    height: SVW * 0.12,
    borderRadius: SVW * 0.06,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SVW * 0.02,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: SVW * 0.08,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: SVW * 0.05,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SVW * 0.2,
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
  clearButtonContainer: {
    paddingVertical: SVW * 0.03,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    borderRadius: 16,
    padding: SVW * 0.04,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  clearButtonText: {
    color: 'white',
    fontSize: SVW * 0.04,
    fontWeight: 'bold',
  },
})
