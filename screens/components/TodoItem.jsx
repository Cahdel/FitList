import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TodoItem({ item, onToggle, onDelete, onEdit }) {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => onToggle(item.id, item.completed)} style={styles.textContainer}>
        <Text style={[styles.text, item.completed && styles.completed]}>{item.title}</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Garis pembatas
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  actions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  actionText: {
    fontSize: 18,
    marginLeft: 10,
  },
}); 