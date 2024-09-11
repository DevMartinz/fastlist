import React, { useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../components/ListItem";
import results from "../../results";

export default function Main({ navigation }) {
	const [list, setList] = useState(results);

	// Função de logout
	const handleLogout = async () => {
		try {
			// Remove o token de autenticação do armazenamento local
			await AsyncStorage.removeItem("userToken");
			// Redireciona para a tela de login
			navigation.replace("Login");
		} catch (error) {
			console.log("Erro ao fazer logout:", error);
		}
	};

	return (
		<View style={styles.container}>
			{/* Botão de logout */}
			<Button title="Logout" onPress={handleLogout} />

			{/* Lista de itens */}
			<FlatList
				data={list}
				renderItem={({ item }) => <ListItem data={item} />}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
});
