import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { auth } from "../../config/firebase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
      setError("Semua field harus diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak sama");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/Login");
    } catch (error) {
      console.log("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("Email sudah digunakan");
      } else if (error.code === "auth/invalid-email") {
        setError("Format email tidak valid");
      } else {
        setError("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
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
        <Text style={styles.title}>Daftar Akun Baru</Text>

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

        <TextInput
          style={styles.input}
          placeholder="Konfirmasi Password"
          placeholderTextColor="#b2aaf7"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#6c5ce7" style={styles.button} />
        ) : (
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Daftar</Text>
          </TouchableOpacity>
        )}

        <View style={styles.loginContainer}>
          <Text style={styles.loginLabel}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.push("/Login")}>
            <Text style={styles.loginText}>Login</Text>
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
  signupButton: {
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
  signupButtonText: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  loginLabel: {
    color: "#6c5ce7",
    fontWeight: "500",
  },
  loginText: {
    color: "#6c5ce7",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});