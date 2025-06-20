import React from "react";
import { Modal, View, Text, TextInput, Button } from "react-native";

export default function EditTodoModal({ visible, editText, setEditText, onSave, onCancel }) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: "#000000aa", justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "white", padding: 20, width: "80%", borderRadius: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Edit To-Do</Text>
          <TextInput value={editText} onChangeText={setEditText} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
          <Button title="Simpan" onPress={onSave} />
          <View style={{ marginTop: 10 }} />
          <Button title="Batal" color="gray" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
} 