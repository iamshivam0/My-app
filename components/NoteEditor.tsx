import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onClose: () => void;
}

export default function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [editedNote, setEditedNote] = useState<Note | null>(note);
  const { colors } = useTheme();

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSave = () => {
    if (editedNote) {
      onSave(editedNote);
    }
  };

  if (!editedNote) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Ionicons name="checkmark" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={[styles.titleInput, { color: colors.text }]}
          value={editedNote.title}
          onChangeText={(text) => setEditedNote({ ...editedNote, title: text })}
          placeholder="Untitled"
          placeholderTextColor={colors.secondary}
        />
        <TextInput
          style={[styles.contentInput, { color: colors.text }]}
          value={editedNote.content}
          onChangeText={(text) =>
            setEditedNote({ ...editedNote, content: text })
          }
          placeholder="Start writing..."
          placeholderTextColor={colors.secondary}
          multiline
        />
      </ScrollView>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="text" size={20} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="list" size={20} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="checkbox" size={20} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="image" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  toolbarButton: {
    padding: 8,
  },
});
