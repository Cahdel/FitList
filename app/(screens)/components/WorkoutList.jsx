// app/(screens)/components/WorkoutList.jsx
import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import WorkoutItem from "./WorkoutItem";

export default function WorkoutList({ data, onToggle, onDelete, onUpdate }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No workouts yet</Text>
        <Text style={styles.emptySubText}>Tap the + button to create your first workout</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <WorkoutItem 
          item={item} 
          onToggle={onToggle} 
          onDelete={onDelete} 
          onUpdate={onUpdate}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 100,
  },
});