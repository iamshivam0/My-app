import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const categories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Other",
];

const ExpenseTracker = () => {
  const { colors } = useTheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [tempAmount, setTempAmount] = useState("");

  const amountInputRef = useRef<TextInput>(null);

  // Load expenses and budget when the component mounts
  useEffect(() => {
    loadExpenses();
    loadBudget();
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 100);
  }, []);

  // Load expenses from AsyncStorage
  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem("expenses");
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  // Save expenses to AsyncStorage
  const saveExpenses = async (updatedExpenses: Expense[]) => {
    try {
      await AsyncStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    } catch (error) {
      console.error("Error saving expenses:", error);
    }
  };

  // Load budget from AsyncStorage
  const loadBudget = async () => {
    try {
      const storedBudget = await AsyncStorage.getItem("budget");
      if (storedBudget) {
        setBudget(storedBudget);
      }
    } catch (error) {
      console.error("Error loading budget:", error);
    }
  };

  // Save budget to AsyncStorage
  const saveBudget = async (newBudget: string) => {
    try {
      await AsyncStorage.setItem("budget", newBudget);
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  // Add a new expense
  const addExpense = () => {
    const parsedAmount = parseFloat(tempAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        "Invalid amount",
        "Please enter a valid number for the amount."
      );
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parsedAmount,
      category,
      description,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setTempAmount("");
    setDescription("");
    amountInputRef.current?.focus();
  };

  // Delete an expense
  const deleteExpense = (id: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedExpenses = expenses.filter(
              (expense) => expense.id !== id
            );
            setExpenses(updatedExpenses);
            saveExpenses(updatedExpenses);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Calculate total expenses
  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate remaining budget
  const getRemainingBudget = () => {
    const totalExpenses = getTotalExpenses();
    return parseFloat(budget) - totalExpenses;
  };

  // Render individual expense items
  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={[styles.expenseItem, { backgroundColor: colors.card }]}>
      <View>
        <Text style={[styles.expenseAmount, { color: colors.text }]}>
          ${item.amount.toFixed(2)}
        </Text>
        <Text style={[styles.expenseCategory, { color: colors.text }]}>
          {item.category}
        </Text>
        {item.description && (
          <Text style={[styles.expenseDescription, { color: colors.text }]}>
            {item.description}
          </Text>
        )}
        <Text style={[styles.expenseDate, { color: colors.text }]}>
          {item.date}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteExpense(item.id)}>
        <Ionicons name="trash-outline" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={[styles.header, { color: colors.text }]}>
              Expense Tracker
            </Text>

            <View style={styles.budgetContainer}>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Set Monthly Budget"
                placeholderTextColor={colors.text + "80"}
                value={budget}
                onChangeText={(text) => {
                  setBudget(text);
                  saveBudget(text);
                }}
                keyboardType="numeric"
              />
              <Text style={[styles.budgetText, { color: colors.text }]}>
                Remaining: ${getRemainingBudget().toFixed(2)}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                ref={amountInputRef}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Amount"
                placeholderTextColor={colors.text + "80"}
                value={tempAmount}
                onChangeText={setTempAmount}
                keyboardType="numeric"
              />
              <View
                style={[styles.pickerContainer, { borderColor: colors.border }]}
              >
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue: string) => setCategory(itemValue)}
                  style={{ color: colors.text }}
                >
                  {categories.map((cat) => (
                    <Picker.Item
                      key={cat}
                      label={cat}
                      value={cat}
                      color={colors.text}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.text + "80"}
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addExpense}
            >
              <Text
                style={[styles.addButtonText, { color: colors.background }]}
              >
                Add Expense
              </Text>
            </TouchableOpacity>
          </>
        }
      />
    </KeyboardAvoidingView>
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
  budgetContainer: {
    marginBottom: 20,
  },
  budgetText: {
    fontSize: 16,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 16,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  expenseCategory: {
    fontSize: 16,
  },
  expenseDescription: {
    fontSize: 14,
  },
  expenseDate: {
    fontSize: 12,
  },
});

export default ExpenseTracker;
