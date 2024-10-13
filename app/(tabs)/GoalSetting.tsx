import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import DeleteGoalModal from "../../components/DeleteGoalModal";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
}

const GoalSetting = () => {
  const { colors } = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem("goals");
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const saveGoals = async (updatedGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem("goals", JSON.stringify(updatedGoals));
    } catch (error) {
      console.error("Error saving goals:", error);
    }
  };

  const addGoal = () => {
    if (newGoalTitle.trim() === "") return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDescription,
      progress: 0,
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setNewGoalTitle("");
    setNewGoalDescription("");
  };

  const updateGoalProgress = (id: string, progress: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? { ...goal, progress: Math.min(Math.max(progress, 0), 100) }
        : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const showDeleteModal = (id: string) => {
    setGoalToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setGoalToDelete(null);
  };

  const deleteGoal = () => {
    if (goalToDelete) {
      const updatedGoals = goals.filter((goal) => goal.id !== goalToDelete);
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      hideDeleteModal();
    }
  };

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <View style={[styles.goalItem, { backgroundColor: colors.card }]}>
      <View style={styles.goalHeader}>
        <Text style={[styles.goalTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <TouchableOpacity onPress={() => showDeleteModal(item.id)}>
          <Ionicons
            name="trash-outline"
            size={24}
            color={colors.error || "#FF0000"}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.goalDescription, { color: colors.secondary }]}>
        {item.description}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${item.progress}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>
      <View style={styles.progressControls}>
        <TouchableOpacity
          onPress={() => updateGoalProgress(item.id, item.progress - 10)}
        >
          <Ionicons
            name="remove-circle-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.progressText, { color: colors.text }]}>
          {item.progress}%
        </Text>
        <TouchableOpacity
          onPress={() => updateGoalProgress(item.id, item.progress + 10)}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Goal Setting</Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="New Goal Title"
        placeholderTextColor={colors.text + "80"} // Using text color with 50% opacity
        value={newGoalTitle}
        onChangeText={setNewGoalTitle}
      />
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Goal Description"
        placeholderTextColor={colors.text + "80"} // Using text color with 50% opacity
        value={newGoalDescription}
        onChangeText={setNewGoalDescription}
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={addGoal}
      >
        <Text style={styles.addButtonText}>Add Goal</Text>
      </TouchableOpacity>
      <FlatList
        data={goals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        style={styles.goalList}
      />
      <DeleteGoalModal
        isVisible={isDeleteModalVisible}
        onClose={hideDeleteModal}
        onDelete={deleteGoal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  goalList: {
    flex: 1,
  },
  goalItem: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  goalDescription: {
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  progressControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  progressText: {
    fontSize: 16,
  },
});

export default GoalSetting;
