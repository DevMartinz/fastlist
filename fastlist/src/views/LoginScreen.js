import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	Image,
} from "react-native";
import CheckBox from "expo-checkbox";
import { useAuth } from "../context/AuthContext"; // Usar o contexto
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";

export default function LoginScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth(); // Pega a função de login do contexto

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert(
				"Campos obrigatórios",
				"Por favor, preencha todos os campos."
			);
			return;
		}

		try {
			const response = await fetch("http://192.168.100.7:8000/api/login", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				await login(data.token, data.user);
				console.log("Login successful", data.token);
				console.log("Login successful", data.user);

				navigation.navigate("ShoppingList");
			} else {
				Alert.alert("Erro no Login: ", data.message);
			}
		} catch (error) {
			Alert.alert("Ocorreu um erro: ", error.message);
		}
	};

	return (
		<View style={styles.container}>
			{/* Adicionando a imagem */}
			<Image
				source={require("../../assets/logo.png")} // Substitua com o caminho da sua imagem
				style={styles.logo}
			/>
			<Text style={styles.title}>FastList</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Senha"
				secureTextEntry
				value={password}
				onChangeText={(text) => setPassword(text)}
			/>
			{/* <View style={styles.checkboxContainer}>
				<CheckBox
					value={isSelected}
					onValueChange={(newValue) => setSelection(newValue)}
				/>
				<Text style={styles.label}>Keep me logged in</Text>
			</View> */}
			<CustomButton title="Login" onPress={handleLogin} />
			<CustomButton
				title="Cadastro"
				onPress={() => navigation.navigate("Register")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
		backgroundColor: "#fff",
	},
	logo: {
		width: 150,
		height: 150,
		alignSelf: "center",
	},
	title: {
		fontSize: 24,
		marginBottom: 16,
		textAlign: "center",
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderBottomWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
	},
	label: {
		margin: 8,
	},
});
