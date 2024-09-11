// src/views/SplashScreen.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
	useEffect(() => {
		const checkAuth = async () => {
			const token = await AsyncStorage.getItem("userToken");
			if (token) {
				console.log(token);
				navigation.navigate("ShoppingList");
			} else {
				navigation.navigate("Login");
			}
		};

		checkAuth();
	}, [navigation]);

	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color="#0000ff" />
			<Text style={styles.text}>Loading...</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	text: {
		marginTop: 20,
		fontSize: 18,
		color: "#000",
	},
});

export default SplashScreen;
