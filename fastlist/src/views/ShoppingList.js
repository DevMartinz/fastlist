import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Button,
	FlatList,
	StyleSheet,
	Modal,
	TextInput,
	TouchableOpacity,
	Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ShoppingList = ({ navigation }) => {
	const [shoppingLists, setShoppingLists] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [newListName, setNewListName] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchShoppingLists = async () => {
			try {
				const token = await AsyncStorage.getItem("userToken");
				console.log("User token:", token);
				if (!token) {
					throw new Error("Token is missing");
				}
				const response = await axios.get(
					"http://192.168.100.7:8000/api/shopping_lists",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setShoppingLists(response.data);
				console.log(response.data);
			} catch (err) {
				console.error("Error fetching shopping lists:", err);
			}
		};

		fetchShoppingLists();
	}, []);

	const handleCreateList = async () => {
		try {
			const token = await AsyncStorage.getItem("userToken");
			if (!token) {
				throw new Error("Token is missing");
			}

			const response = await fetch(
				"http://192.168.100.7:8000/api/shopping_lists",
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Inclua o token corretamente
					},
					body: JSON.stringify({
						name: newListName, // Dados da nova lista
					}),
				}
			);

			const data = await response.json();

			if (response.ok) {
				// Atualize as listas após criar uma nova
				setShoppingLists([...shoppingLists, data.shoppingList]);
			} else {
				Alert.alert("Error creating list", data.message);
			}
		} catch (error) {
			Alert.alert("An error occurred", error.message);
		}
	};

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem("userToken");
			await AsyncStorage.removeItem("userId"); // Remova o userId também
			navigation.navigate("Login"); // Redireciona para a tela de login
		} catch (error) {
			console.error("Failed to logout", error);
		}
	};

	return (
		<View style={styles.container}>
			<Button title="Add New List" onPress={() => setModalVisible(true)} />
			<Button title="Logout" onPress={handleLogout} color="red" />

			<FlatList
				data={shoppingLists}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("ListItemsScreen", { listId: item.id })
						}
					>
						<Text style={styles.listItem}>{item.name}</Text>
					</TouchableOpacity>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.modalView}>
					<TextInput
						placeholder="Enter list name"
						value={newListName}
						onChangeText={setNewListName}
						style={styles.input}
					/>
					{error ? <Text style={styles.errorText}>{error}</Text> : null}
					<Button title="Create List" onPress={handleCreateList} />
					<Button title="Cancel" onPress={() => setModalVisible(false)} />
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	listItem: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
		width: "100%",
	},
	errorText: {
		color: "red",
		marginBottom: 10,
	},
});

export default ShoppingList;
