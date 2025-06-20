// app/(screens)/Home.jsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../config/firebase";
import WorkoutList from "./components/WorkoutList";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);

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

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "workouts"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWorkouts(data);
    });
    return unsub;
  }, [user]);

  const handleToggle = async (item) => {
    try {
      await updateDoc(doc(db, "workouts", item.id), { 
        completed: !item.completed 
      });
    } catch (error) {
      console.error("Error updating workout:", error);
      Alert.alert("Error", "Gagal mengupdate status workout");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "workouts", id), {
        ...updatedData,
        updatedAt: new Date(),
      });
      Alert.alert("Success", "Workout berhasil diupdate!");
    } catch (error) {
      console.error("Error updating workout:", error);
      Alert.alert("Error", "Gagal mengupdate workout");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "workouts", id));
      Alert.alert("Success", "Workout berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting workout:", error);
      Alert.alert("Error", "Gagal menghapus workout");
    }
  };

  const handleLogout = async () => {
    console.log("Logging out user:", user?.email);
    try {
      await signOut(auth);
      router.replace("/Login");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Gagal logout");
    }
  };

  const completedCount = workouts.filter(w => w.completed).length;
  const totalCount = workouts.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.email || "User"}</Text>
          <Text style={styles.title}>Workout Tracker</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCount - completedCount}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>

      {/* Workout List */}
      <ScrollView style={styles.workoutContainer} showsVerticalScrollIndicator={false}>
        <WorkoutList 
          data={workouts} 
          onToggle={handleToggle} 
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push("/CreateWorkout")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  greeting: {
    fontSize: 16,
    color: "#ddd6fe",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 50,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6c5ce7",
  },
  statLabel: {
    fontSize: 12,
    color: "#74788d",
    marginTop: 4,
  },
  workoutContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#6c5ce7",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});