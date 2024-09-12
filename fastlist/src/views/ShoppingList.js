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
import Icon from "react-native-vector-icons/Ionicons"; // Adicione o ícone
import { useAuth } from "../context/AuthContext";

const ShoppingList = ({ navigation }) => {
	const { user, token, logout } = useAuth();
	const [shoppingLists, setShoppingLists] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [newListName, setNewListName] = useState("");
	const [selectedListId, setSelectedListId] = useState(null); // Para renomear
	const [showOptionsModal, setShowOptionsModal] = useState(false); // Para o menu de opções
	const [editListModalVisible, setEditListModalVisible] = useState(false); // Para o modal de renomear
	const [editListName, setEditListName] = useState(""); // Para o nome da lista a ser renomeada
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchShoppingLists = async () => {
			try {
				if (!token) {
					// console.error("Token is missing");
					// Se o token não existir, redirecione para a tela de login
					navigation.replace("Login");
					return;
				}

				const response = await axios.get(
					"http://192.168.100.7:8000/api/shopping_lists",
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setShoppingLists(response.data);
			} catch (err) {
				console.error("Error fetching shopping lists:", err);
			}
		};

		fetchShoppingLists();
	}, [token]);

	const handleCreateList = async () => {
		try {
			if (!token) throw new Error("Token is missing");

			const response = await fetch(
				"http://192.168.100.7:8000/api/shopping_lists",
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ name: newListName }),
				}
			);

			const data = await response.json();
			if (
				response.ok &&
				data.message === "Shopping list created successfully"
			) {
				setShoppingLists([...shoppingLists, data.shoppingList]);
				setNewListName("");
				setModalVisible(false);
			} else {
				Alert.alert("Error", data.message || "Something went wrong");
			}
		} catch (error) {
			Alert.alert("An error occurred", error.message);
		}
	};

	const handleDeleteList = async (listId) => {
		try {
			const response = await axios.delete(
				`http://192.168.100.7:8000/api/shopping_lists/${listId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (response.status === 200) {
				setShoppingLists(shoppingLists.filter((list) => list.id !== listId));
				setShowOptionsModal(false);
				Alert.alert("Success", "List deleted successfully");
			}
		} catch (error) {
			Alert.alert("Error", "Could not delete the list");
		}
	};

	const handleRenameList = (listId, newName) => {
		setSelectedListId(listId);
		setEditListName(newName);
		setEditListModalVisible(true);
	};

	const submitRenameList = async () => {
		try {
			const response = await axios.put(
				`http://192.168.100.7:8000/api/shopping_lists/${selectedListId}`,
				{ name: editListName },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.status === 200) {
				setShoppingLists(
					shoppingLists.map((list) =>
						list.id === selectedListId ? { ...list, name: editListName } : list
					)
				);
				setEditListModalVisible(false);
				Alert.alert("Success", "List renamed successfully");
			}
		} catch (error) {
			Alert.alert("Error", "Could not rename the list");
		}
	};

	const openOptionsModal = (listId) => {
		setSelectedListId(listId);
		setShowOptionsModal(true);
	};

	const handleLogout = async () => {
		try {
			await logout(); // Usando o logout do contexto
			navigation.navigate("Login"); // Redirecionando para a tela de login
		} catch (error) {
			console.error("Failed to logout", error);
		}
	};

	if (!user) {
		// Exibe mensagem de carregamento ou redireciona para o login se o usuário não estiver autenticado
		return (
			<View style={styles.container}>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Button title="Add New List" onPress={() => setModalVisible(true)} />
			<Button title="Logout" onPress={handleLogout} color="red" />

			<FlatList
				data={shoppingLists}
				renderItem={({ item }) => (
					<View style={styles.listItemContainer}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("ListItemsScreen", { listId: item.id })
							}
						>
							<Text style={styles.listItem}>{item.name}</Text>
						</TouchableOpacity>
						{/* Ícone de três pontinhos */}
						<TouchableOpacity
							onPress={() => openOptionsModal(item.id)}
							style={styles.iconButton}
						>
							<Icon name="ellipsis-vertical" size={20} color="black" />
						</TouchableOpacity>
					</View>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>

			{/* Modal de criação de lista */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(!modalVisible)}
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

			{/* Modal de opções */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={showOptionsModal}
				onRequestClose={() => setShowOptionsModal(false)}
			>
				<View style={styles.optionsModal}>
					<Button
						title="Rename List"
						onPress={() => {
							handleRenameList(
								selectedListId,
								shoppingLists.find((list) => list.id === selectedListId)?.name
							);
							setShowOptionsModal(false);
						}}
					/>
					<Button
						title="Delete List"
						onPress={() => handleDeleteList(selectedListId)}
					/>
					<Button title="Cancel" onPress={() => setShowOptionsModal(false)} />
				</View>
			</Modal>

			{/* Modal de renomear lista */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={editListModalVisible}
				onRequestClose={() => setEditListModalVisible(false)}
			>
				<View style={styles.modalView}>
					<TextInput
						placeholder="Enter new list name"
						value={editListName}
						onChangeText={setEditListName}
						style={styles.input}
					/>
					<Button title="Save" onPress={submitRenameList} />
					<Button
						title="Cancel"
						onPress={() => setEditListModalVisible(false)}
					/>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: "#fff" },
	listItemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
	},
	listItem: { fontSize: 18 },
	iconButton: { padding: 8 },
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	optionsModal: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		backgroundColor: "#fff",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
	},
	input: { width: "100%", padding: 10, borderColor: "#ccc", borderWidth: 1 },
	errorText: { color: "red" },
});

export default ShoppingList;
