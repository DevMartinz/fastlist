import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import CustomButton from "../../components/CustomButton";

// Função para validar email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // Validar campos
    if (!name || !email || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não estão iguais.");
      return;
    }

    try {
      console.log("Sending data:", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      const response = await axios.post(
        "http://192.168.100.7:8000/api/register",
        {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }
      );
      console.log("Response:", response.data);
      navigation.navigate("Login");
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError("Falha no registro. Por favor, tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirme a Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <CustomButton title="Cadastrar" onPress={handleRegister} color="#4682B4" />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: "10%",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: "red",
    marginTop: 12,
  },
});

export default RegisterScreen;
