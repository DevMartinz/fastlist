import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import CheckBox from "expo-checkbox";
import { useAuth } from "../context/AuthContext"; // Usar o contexto
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth(); // Pega a função de login do contexto

	const handleLogin = async () => {
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

				// Optionally save user ID if returned from API
				// if (data.user && data.user.id) {
				// 	await AsyncStorage.setItem("userId", data.user.id.toString());
				// }

				navigation.navigate("ShoppingList");
			} else {
				Alert.alert("Login failed", data.message);
			}
		} catch (error) {
			Alert.alert("An error occurred", error.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Login</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
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
			<Button title="Login" onPress={handleLogin} />
			<Button
				title="Register"
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
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	label: {
		margin: 8,
	},
});
