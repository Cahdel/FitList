import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.reset === "true") {
      setEmail("");
      setPassword("");
    }
  }, [params]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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
      {/* Decorative Header */}
      <View style={styles.headerBg}>
        <Image
          source={{ uri: "https://img.icons8.com/ios-filled/100/ffffff/dumbbell.png" }}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>FitList</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Login</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#b2aaf7"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#b2aaf7"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#6c5ce7" style={styles.button} />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}

        <View style={styles.signupContainer}>
          <Text style={styles.signupLabel}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push("/Signup")}>
            <Text style={styles.signupText}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6c5ce7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBg: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    tintColor: "#fff",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 10,
  },
  formCard: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6c5ce7",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#6c5ce7",
    padding: 12,
    marginBottom: 14,
    borderRadius: 8,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#f7f6fd",
  },
  button: {
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 8,
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 1,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  signupLabel: {
    color: "#6c5ce7",
    fontWeight: "500",
  },
  signupText: {
    color: "#6c5ce7",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});