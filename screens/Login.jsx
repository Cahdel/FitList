import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams();

  // Reset input fields jika kembali dari halaman lain dengan reset=true
  useEffect(() => {
    if (params.reset === "true") {
      setEmail("");
      setPassword("");
    }
  }, [params]);

  // Cek apakah user sudah login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User sudah login, redirect ke Home
        router.replace("/Home");
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Email dan password tidak boleh kosong");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/Home");
    } catch (error) {
      console.log("Login error:", error);
      
      if (error.code === "auth/invalid-credential") {
        setError("Email atau password salah");
      } else {
        setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" style={styles.button} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <View style={styles.signupContainer}>
        <Text>Belum punya akun? </Text>
        <TouchableOpacity onPress={() => router.push("/Signup")}>
          <Text style={styles.signupText}>Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "blue",
    fontWeight: "bold",
  },
}); 