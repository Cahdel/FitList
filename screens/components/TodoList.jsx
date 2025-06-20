import React from "react";
import { FlatList } from "react-native";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
  return <FlatList data={todos} keyExtractor={(item) => item.id} renderItem={({ item }) => <TodoItem item={item} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />} />;
} 