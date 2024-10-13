import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "../app/context/ThemeContext";

interface DeleteGoalModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteGoalModal: React.FC<DeleteGoalModalProps> = ({
  isVisible,
  onClose,
  onDelete,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalText, { color: colors.text }]}>
            Delete Goal
          </Text>
          <Text style={[styles.modalDescription, { color: colors.secondary }]}>
            Are you sure you want to delete this goal?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: colors.border },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                { backgroundColor: colors.error },
              ]}
              onPress={onDelete}
            >
              <Text style={[styles.buttonText, { color: "#fff" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalDescription: {
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default DeleteGoalModal;
