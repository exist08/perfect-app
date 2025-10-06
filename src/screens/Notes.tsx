import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SVW } from '../utils/Constants'
import NoteCard from '../components/NoteCard'
import { Note, NOTE_COLORS } from '../types/note'
import { MMKV } from 'react-native-mmkv'
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'

const storage = new MMKV()
const NOTES_KEY = 'notes'

const Notes = () => {
  const insets = useSafeAreaInsets()
  const [notes, setNotes] = useState<Note[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0])

  // Load notes from MMKV on mount
  useEffect(() => {
    const storedNotes = storage.getString(NOTES_KEY)
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes))
    }
  }, [])

  // Save notes to MMKV whenever they change
  useEffect(() => {
    storage.set(NOTES_KEY, JSON.stringify(notes))
  }, [notes])

  const openNewNoteModal = () => {
    setEditingNote(null)
    setTitle('')
    setContent('')
    setSelectedColor(NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)])
    setModalVisible(true)
  }

  const openEditNoteModal = (note: Note) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setSelectedColor(note.color)
    setModalVisible(true)
  }

  const saveNote = () => {
    if (title.trim() === '') return

    if (editingNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, title: title.trim(), content: content.trim(), color: selectedColor, updatedAt: Date.now() }
          : note
      ))
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        color: selectedColor,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setNotes([newNote, ...notes])
    }

    setModalVisible(false)
  }

  const deleteNote = (note: Note) => {
    setNotes(notes.filter(n => n.id !== note.id))
    if (editingNote?.id === note.id) {
      setModalVisible(false)
    }
  }

  // Split notes into two columns for masonry layout
  const leftColumnNotes = notes.filter((_, index) => index % 2 === 0)
  const rightColumnNotes = notes.filter((_, index) => index % 2 === 1)

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
        <Text style={styles.headerTitle}>📝 My Notes</Text>
        <Text style={styles.headerSubtitle}>{notes.length} notes</Text>
      </Animated.View>

      {/* Notes Grid - Masonry Style */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notes.length === 0 ? (
          <Animated.View 
            style={styles.emptyContainer}
            entering={FadeIn.duration(500).delay(300)}
          >
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No notes yet!</Text>
            <Text style={styles.emptySubtext}>Tap the + button to create your first note</Text>
          </Animated.View>
        ) : (
          <View style={styles.masonryContainer}>
            <View style={styles.column}>
              {leftColumnNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPress={openEditNoteModal}
                  onLongPress={deleteNote}
                  index={index * 2}
                />
              ))}
            </View>
            <View style={styles.column}>
              {rightColumnNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPress={openEditNoteModal}
                  onLongPress={deleteNote}
                  index={index * 2 + 1}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <Animated.View
        style={styles.fabContainer}
        entering={FadeIn.duration(500).delay(200)}
      >
        <Pressable 
          style={styles.fab}
          onPress={openNewNoteModal}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </Animated.View>

      {/* Note Editor Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={[styles.modalContainer, { backgroundColor: selectedColor }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Modal Header */}
          <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>{editingNote ? 'Edit Note' : 'New Note'}</Text>
            <Pressable onPress={saveNote}>
              <Text style={styles.modalSave}>Save</Text>
            </Pressable>
          </View>

          {/* Color Picker */}
          <ScrollView 
            horizontal 
            style={styles.colorPicker}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorPickerContent}
          >
            {NOTE_COLORS.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Text style={styles.colorCheckmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </ScrollView>

          {/* Note Input */}
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="Start writing..."
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Delete Button for editing mode */}
          {editingNote && (
            <Pressable 
              style={styles.deleteNoteButton}
              onPress={() => deleteNote(editingNote)}
            >
              <Text style={styles.deleteNoteText}>🗑️ Delete Note</Text>
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

export default Notes

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
    marginBottom: SVW * 0.01,
  },
  headerSubtitle: {
    fontSize: SVW * 0.04,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SVW * 0.05,
    paddingBottom: SVW * 0.2,
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SVW * 0.03,
  },
  column: {
    flex: 1,
  },
  emptyContainer: {
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
    backgroundColor: '#FF9500',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SVW * 0.05,
    paddingBottom: SVW * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
  colorPicker: {
    marginVertical: SVW * 0.03,
  },
  colorPickerContent: {
    paddingHorizontal: SVW * 0.05,
    gap: SVW * 0.03,
  },
  colorOption: {
    width: SVW * 0.12,
    height: SVW * 0.12,
    borderRadius: SVW * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
  },
  colorCheckmark: {
    fontSize: SVW * 0.06,
    color: '#333',
    fontWeight: 'bold',
  },
  noteInputContainer: {
    flex: 1,
    paddingHorizontal: SVW * 0.05,
  },
  titleInput: {
    fontSize: SVW * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: SVW * 0.03,
    paddingVertical: SVW * 0.02,
  },
  contentInput: {
    flex: 1,
    fontSize: SVW * 0.04,
    color: '#555',
    lineHeight: SVW * 0.06,
  },
  deleteNoteButton: {
    margin: SVW * 0.05,
    padding: SVW * 0.04,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteNoteText: {
    color: 'white',
    fontSize: SVW * 0.04,
    fontWeight: 'bold',
  },
})
