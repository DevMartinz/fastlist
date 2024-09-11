import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const handleRegister = async () => {
		if (password !== confirmPassword) {
			setError("Passwords do not match");
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
			setError("Registration failed. Please try again.");
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Name"
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
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.input}
			/>
			<TextInput
				placeholder="Confirm Password"
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				secureTextEntry
				style={styles.input}
			/>
			<Button title="Register" onPress={handleRegister} />
			{error ? <Text>{error}</Text> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
	},
});

export default RegisterScreen;
