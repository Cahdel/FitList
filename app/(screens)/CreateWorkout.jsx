import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import WorkoutInput from "./components/WorkoutInput";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function CreateWorkout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ day: "", exercise: "", reps: "", sets: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/Login");
      } else {
        setUser(user);
      }
    });
    return unsub;
  }, []);

  const handleAdd = async () => {
    const { day, exercise, reps, sets } = form;
    if (!day || !exercise || !reps || !sets) {
      Alert.alert("Error", "Semua data wajib diisi");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "workouts"), {
        ...form,
        reps: parseInt(reps),
        sets: parseInt(sets),
        completed: false,
        userId: user.uid,
        createdAt: new Date(),
      });
      
      Alert.alert("Success", "Workout berhasil ditambahkan!", [
        { text: "OK", onPress: () => {
          setForm({ day: "", exercise: "", reps: "", sets: "" });
          router.back();
        }}
      ]);
    } catch (e) {
      Alert.alert("Error", "Gagal menambahkan workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Workout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <WorkoutInput 
          form={form} 
          setForm={setForm} 
          handleAdd={handleAdd} 
          loading={loading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#6c5ce7",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});