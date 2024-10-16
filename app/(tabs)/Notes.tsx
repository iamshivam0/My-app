import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoteEditor from "../../components/NoteEditor";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../app/context/ThemeContext";

interface Note {
  id: string;
  title: string;
  content: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUM_COLUMNS = 2;
const CARD_MARGIN = 10;
const CARD_WIDTH =
  (SCREEN_WIDTH - 40 - (NUM_COLUMNS - 1) * CARD_MARGIN) / NUM_COLUMNS;

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const { colors, theme } = useTheme();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const addNote = () => {
    if (newNoteTitle.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle.trim(),
        content: "",
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setNewNoteTitle("");
      setSelectedNote(newNote);
      setIsEditorVisible(true);
    }
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedNotes = notes.filter((note) => note.id !== id);
            setNotes(updatedNotes);
            saveNotes(updatedNotes);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorVisible(true);
  };

  const closeEditor = () => {
    setIsEditorVisible(false);
    setSelectedNote(null);
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    closeEditor();
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      onPress={() => openNote(item)}
      style={styles.cardContainer}
    >
      <View style={[styles.noteItem, { backgroundColor: colors.card }]}>
        <Text
          style={[styles.noteTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.noteContent, { color: colors.text }]}
          numberOfLines={3}
        >
          {item.content}
        </Text>
        <TouchableOpacity
          onPress={() => deleteNote(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>My Notes</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          value={newNoteTitle}
          onChangeText={setNewNoteTitle}
          placeholder="Enter a new note title"
          placeholderTextColor={colors.secondary}
        />
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <Ionicons name="add-circle" size={48} color={colors.secondary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNoteItem}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.noteList}
        columnWrapperStyle={styles.columnWrapper}
      />
      <Modal visible={isEditorVisible} animationType="slide">
        <NoteEditor
          note={selectedNote}
          onSave={updateNote}
          onClose={closeEditor}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
  },
  addButton: {
    padding: 5,
  },
  noteList: {
    alignItems: "flex-start",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: -CARD_MARGIN / 2, // Add negative horizontal margin
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: CARD_MARGIN,
    marginHorizontal: CARD_MARGIN / 2, // Add horizontal margin to each card
  },
  noteItem: {
    height: CARD_WIDTH,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
  },
  deleteButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 5,
  },
});
