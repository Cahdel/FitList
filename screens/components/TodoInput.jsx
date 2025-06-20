import React from "react";
import { TextInput, Button, View } from "react-native";

export default function TodoInput({ todo, setTodo, addTodo }) {
  return (
    <View>
      <TextInput placeholder="Tambah to-do..." value={todo} onChangeText={setTodo} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
      <Button title="Tambah" onPress={addTodo} />
    </View>
  );
} 