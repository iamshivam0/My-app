import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ListRenderItem,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoanRecord {
  id: string;
  name: string;
  amount: number;
  date: string;
  description?: string;
  completed?: boolean;
}

interface PersonLoan {
  name: string;
  totalAmount: number;
  loans: LoanRecord[];
}

const InputFields = ({
  addLoan,
  colors,
}: {
  addLoan: (name: string, amount: string, description: string) => void;
  colors: any;
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleAddLoan = () => {
    addLoan(name, amount, description);
    setName("");
    setAmount("");
    setDescription("");
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholder="Name"
        placeholderTextColor={colors.secondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholder="Amount"
        placeholderTextColor={colors.secondary}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholder="Description (optional)"
        placeholderTextColor={colors.secondary}
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={handleAddLoan}
      >
        <Text style={styles.addButtonText}>Add Loan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function BorrowScreen() {
  const { colors } = useTheme();
  const [loans, setLoans] = useState<PersonLoan[]>([]);
  const [editingLoan, setEditingLoan] = useState<LoanRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  const totalAmountLent = useMemo(() => {
    return loans.reduce((total, person) => total + person.totalAmount, 0);
  }, [loans]);

  const loadLoans = async () => {
    try {
      const storedLoans = await AsyncStorage.getItem("loans");
      if (storedLoans) {
        const parsedLoans = JSON.parse(storedLoans);
        const validLoans = parsedLoans.filter(
          (loan: PersonLoan) =>
            loan &&
            typeof loan.totalAmount === "number" &&
            Array.isArray(loan.loans) &&
            loan.name
        );
        setLoans(validLoans);
      }
    } catch (error) {
      console.error("Error loading loans:", error);
      Alert.alert("Error", "Failed to load loans. Please try again.");
    }
  };

  const saveLoans = async (updatedLoans: PersonLoan[]) => {
    try {
      await AsyncStorage.setItem("loans", JSON.stringify(updatedLoans));
    } catch (error) {
      console.error("Error saving loans:", error);
    }
  };

  const addLoan = (name: string, amount: string, description: string) => {
    if (name && amount) {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber)) {
        Alert.alert("Error", "Please enter a valid number for the amount");
        return;
      }

      const newLoan: LoanRecord = {
        id: Date.now().toString(),
        name,
        amount: amountNumber,
        date: new Date().toLocaleDateString(),
        description: description.trim() || undefined,
      };

      const updatedLoans = [...loans];
      const personIndex = updatedLoans.findIndex((p) => p.name === name);

      if (personIndex !== -1) {
        updatedLoans[personIndex].loans.push(newLoan);
        updatedLoans[personIndex].totalAmount += newLoan.amount;
      } else {
        updatedLoans.push({
          name,
          totalAmount: newLoan.amount,
          loans: [newLoan],
        });
      }

      setLoans(updatedLoans);
      saveLoans(updatedLoans);
    } else {
      Alert.alert("Error", "Please enter both name and amount");
    }
  };

  const deleteLoan = (personName: string, loanId: string) => {
    const updatedLoans = loans
      .map((person) => {
        if (person.name === personName) {
          const updatedPersonLoans = person.loans.filter(
            (loan) => loan.id !== loanId
          );
          const updatedTotalAmount = updatedPersonLoans.reduce(
            (total, loan) => total + loan.amount,
            0
          );
          return {
            ...person,
            loans: updatedPersonLoans,
            totalAmount: updatedTotalAmount,
          };
        }
        return person;
      })
      .filter((person) => person.loans.length > 0);

    setLoans(updatedLoans);
    saveLoans(updatedLoans);
  };

  const completeLoan = (personName: string, loanId: string) => {
    const updatedLoans = loans.map((person) => {
      if (person.name === personName) {
        const updatedPersonLoans = person.loans.map((loan) =>
          loan.id === loanId ? { ...loan, completed: true } : loan
        );
        const completedLoan = updatedPersonLoans.find(
          (loan) => loan.id === loanId
        );
        const updatedTotalAmount =
          person.totalAmount - (completedLoan?.amount || 0);
        return {
          ...person,
          loans: updatedPersonLoans,
          totalAmount: updatedTotalAmount,
        };
      }
      return person;
    });

    setLoans(updatedLoans);
    saveLoans(updatedLoans);
  };

  const openEditModal = (loan: LoanRecord) => {
    setEditingLoan(loan);
    setModalVisible(true);
  };

  const updateLoan = (updatedLoan: LoanRecord) => {
    const updatedLoans = loans.map((person) => {
      if (person.name === updatedLoan.name) {
        const updatedPersonLoans = person.loans.map((loan) =>
          loan.id === updatedLoan.id ? updatedLoan : loan
        );
        const updatedTotalAmount = updatedPersonLoans.reduce(
          (total, loan) => total + loan.amount,
          0
        );
        return {
          ...person,
          loans: updatedPersonLoans,
          totalAmount: updatedTotalAmount,
        };
      }
      return person;
    });

    setLoans(updatedLoans);
    saveLoans(updatedLoans);
    setModalVisible(false);
    setEditingLoan(null);
  };

  const renderLoanItem: ListRenderItem<PersonLoan> = ({ item }) => (
    <View style={[styles.personCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.personName, { color: colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.totalAmount, { color: colors.primary }]}>
        Total Outstanding: ₹{(item.totalAmount || 0).toFixed(2)}
      </Text>
      {item.loans.map((loan) => (
        <View key={loan.id} style={styles.loanItem}>
          <View>
            <Text
              style={[
                styles.loanAmount,
                { color: loan.completed ? colors.success : colors.text },
              ]}
            >
              ₹{(loan.amount || 0).toFixed(2)} {loan.completed && "(Completed)"}
            </Text>
            <Text style={[styles.loanDate, { color: colors.secondary }]}>
              {loan.date}
            </Text>
            {loan.description && (
              <Text style={[styles.loanDescription, { color: colors.text }]}>
                {loan.description}
              </Text>
            )}
          </View>
          <View style={styles.actionButtons}>
            {!loan.completed && (
              <>
                <TouchableOpacity
                  onPress={() => openEditModal(loan)}
                  style={styles.actionButton}
                >
                  <Text
                    style={[styles.actionButtonText, { color: colors.primary }]}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => completeLoan(item.name, loan.id)}
                  style={styles.actionButton}
                >
                  <Text
                    style={[styles.actionButtonText, { color: colors.success }]}
                  >
                    Complete
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              onPress={() => deleteLoan(item.name, loan.id)}
              style={styles.actionButton}
            >
              <Text style={[styles.actionButtonText, { color: colors.error }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryText, { color: colors.text }]}>
          Total Amount Lent:
        </Text>
        <Text style={[styles.summaryAmount, { color: colors.primary }]}>
          ₹{totalAmountLent.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={loans}
        renderItem={renderLoanItem}
        keyExtractor={(item) => item.name}
        style={styles.loanList}
        ListHeaderComponent={<InputFields addLoan={addLoan} colors={colors} />}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Loan
            </Text>
            {editingLoan && (
              <>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, color: colors.text },
                  ]}
                  value={editingLoan.amount.toString()}
                  onChangeText={(text) =>
                    setEditingLoan({
                      ...editingLoan,
                      amount: parseFloat(text) || 0,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="Amount"
                  placeholderTextColor={colors.secondary}
                />
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, color: colors.text },
                  ]}
                  value={editingLoan.description}
                  onChangeText={(text) =>
                    setEditingLoan({ ...editingLoan, description: text })
                  }
                  placeholder="Description"
                  placeholderTextColor={colors.secondary}
                />
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={() => updateLoan(editingLoan)}
                >
                  <Text style={styles.textStyle}>Update Loan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.error }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inputContainer: {
    padding: 20,
  },
  input: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loanList: {
    flex: 1,
  },
  personCard: {
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  personName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loanItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  loanAmount: {
    fontSize: 14,
  },
  loanDate: {
    fontSize: 12,
  },
  loanDescription: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  actionButton: {
    padding: 5,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    minWidth: 100,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
