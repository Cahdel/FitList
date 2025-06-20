import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Modal, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, updateDoc, doc, orderBy } from "firebase/firestore";
import TodoItem from "./components/TodoItem"; 
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import EditTodoModal from "./components/EditTodoModal";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const router = useRouter();

  // Cek user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/Login");
      } else {
        setUser(currentUser);
      }
      setLoadingUser(false);
    });

    return unsubscribe;
  }, []);

  // Ambil data todo dari Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "todos"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTodos(list);
    });

    return unsubscribe;
  }, [user]);

  const addTodo = async () => {
    if (todo.trim() === "") return;

    await addDoc(collection(db, "todos"), {
      title: todo,
      completed: false,
      createdAt: new Date(),
      userId: user.uid,
    });

    setTodo("");
  };

  const toggleComplete = async (id, status) => {
    await updateDoc(doc(db, "todos", id), { completed: !status });
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const openEditModal = (item) => {
    setEditTodo(item);
    setEditText(item.title);
    setEditModalVisible(true);
  };

  const handleEditSave = async () => {
    if (!editText.trim()) {
      Alert.alert("Isi tidak boleh kosong");
      return;
    }

    await updateDoc(doc(db, "todos", editTodo.id), {
      title: editText,
    });

    setEditModalVisible(false);
    setEditTodo(null);
    setEditText("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace({ pathname: "/Login", params: { reset: "true" } });
  };

  // Tampilkan loading selama pengecekan user
  if (loadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>To-Do List</Text>
      <Text style={{ marginBottom: 20 }}>Welcome, {user?.email}</Text>
      
      <TodoInput todo={todo} setTodo={setTodo} addTodo={addTodo} />

      <TodoList 
        todos={todos} 
        onToggle={toggleComplete} 
        onDelete={deleteTodo} 
        onEdit={openEditModal} 
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>

      <EditTodoModal
        visible={editModalVisible}
        editText={editText}
        setEditText={setEditText}
        onSave={handleEditSave}
        onCancel={() => setEditModalVisible(false)}
      />
    </View>
  );
} 