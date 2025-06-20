// app/(screens)/components/WorkoutItem.jsx
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  Modal, 
  TextInput, 
  Alert,
  ScrollView 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutItem({ item, onToggle, onDelete, onUpdate }) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    day: item.day,
    exercise: item.exercise,
    reps: item.reps.toString(),
    sets: item.sets.toString()
  });

  const handleEdit = () => {
    setEditForm({
      day: item.day,
      exercise: item.exercise,
      reps: item.reps.toString(),
      sets: item.sets.toString()
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    const { day, exercise, reps, sets } = editForm;
    
    if (!day || !exercise || !reps || !sets) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    const updatedData = {
      day,
      exercise,
      reps: parseInt(reps),
      sets: parseInt(sets)
    };

    onUpdate(item.id, updatedData);
    setEditModalVisible(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Hapus Workout",
      `Apakah Anda yakin ingin menghapus workout "${item.exercise}"?`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: () => onDelete(item.id) 
        }
      ]
    );
  };

  return (
    <View style={[styles.card, item.completed && styles.completedCard]}>
      <View style={styles.header}>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.exerciseTitle, item.completed && styles.completedText]}>
            {item.exercise}
          </Text>
          <Text style={styles.dayBadge}>{item.day}</Text>
        </View>
        <Switch 
          value={item.completed} 
          onValueChange={() => onToggle(item)}
          trackColor={{ false: "#e5e7eb", true: "#6c5ce7" }}
          thumbColor={item.completed ? "#fff" : "#f4f4f4"}
        />
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="repeat-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.reps} reps</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="layers-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.sets} sets</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={16} color="#6c5ce7" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={confirmDelete}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Workout</Text>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Day</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={editForm.day}
                    onValueChange={(value) => setEditForm({ ...editForm, day: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Day" value="" />
                    <Picker.Item label="Monday" value="Monday" />
                    <Picker.Item label="Tuesday" value="Tuesday" />
                    <Picker.Item label="Wednesday" value="Wednesday" />
                    <Picker.Item label="Thursday" value="Thursday" />
                    <Picker.Item label="Friday" value="Friday" />
                    <Picker.Item label="Saturday" value="Saturday" />
                    <Picker.Item label="Sunday" value="Sunday" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Exercise</Text>
                <TextInput
                  placeholder="e.g., Push Up, Squat, etc."
                  value={editForm.exercise}
                  onChangeText={(text) => setEditForm({ ...editForm, exercise: text })}
                  style={styles.input}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Reps</Text>
                  <TextInput
                    placeholder="12"
                    keyboardType="numeric"
                    value={editForm.reps}
                    onChangeText={(text) => setEditForm({ ...editForm, reps: text })}
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                  <Text style={styles.label}>Sets</Text>
                  <TextInput
                    placeholder="3"
                    keyboardType="numeric"
                    value={editForm.sets}
                    onChangeText={(text) => setEditForm({ ...editForm, sets: text })}
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedCard: {
    backgroundColor: "#f0fdf4",
    borderColor: "#6c5ce7",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  dayBadge: {
    fontSize: 12,
    color: "#6c5ce7",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  details: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f9ff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  editText: {
    color: "#6c5ce7",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  deleteText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#6c5ce7",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});