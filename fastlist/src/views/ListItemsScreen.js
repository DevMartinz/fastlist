import React, { useEffect, useState } from "react";
import {
	View,
	FlatList,
	Text,
	TextInput,
	StyleSheet,
	Modal,
	TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../components/ListItem"; // Importe o componente ListItem
import CustomButton from "../components/CustomButton"; // Importe o CustomButton
import Icon from "react-native-vector-icons/Ionicons";

const ListItemsScreen = ({ route }) => {
	const { listId } = route.params;
	const [items, setItems] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [itemName, setItemName] = useState("");
	const [itemValue, setItemValue] = useState("");
	const [itemQuantity, setItemQuantity] = useState("");
	const [selectedItemId, setSelectedItemId] = useState(null);
	const [errorName, setErrorName] = useState("");
	const [errorValue, setErrorValue] = useState("");
	const [errorQuantity, setErrorQuantity] = useState("");

	useEffect(() => {
		const fetchItems = async () => {
			const token = await AsyncStorage.getItem("userToken");
			try {
				const response = await axios.get(
					`http://192.168.100.7:8000/api/shopping-lists/${listId}/products`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setItems(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchItems();
	}, [listId]);

	const handleAddItem = async () => {
		let hasError = false;

		// Reset errors
		setErrorName("");
		setErrorValue("");
		setErrorQuantity("");

		// Verifica se o nome está preenchido
		if (!itemName) {
			setErrorName("O nome do item é obrigatório.");
			hasError = true;
		}

		// Verifica se o valor está preenchido
		if (!itemValue) {
			setErrorValue("O valor do item é obrigatório.");
			hasError = true;
		}

		// Verifica se a quantidade está preenchida
		if (!itemQuantity) {
			setErrorQuantity("A quantidade do item é obrigatória.");
			hasError = true;
		}

		if (hasError) {
			return;
		}

		const token = await AsyncStorage.getItem("userToken");

		const cleanedValue = itemValue
			.replace("R$ ", "")
			.replace(/\./g, "")
			.replace(",", ".");

		try {
			if (selectedItemId) {
				// Editando item
				await axios.put(
					`http://192.168.100.7:8000/api/products/${selectedItemId}`,
					{
						name: itemName,
						value: cleanedValue,
						quantity: itemQuantity,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
			} else {
				// Adicionando novo item
				await axios.post(
					`http://192.168.100.7:8000/api/shopping-lists/${listId}/products`,
					{
						name: itemName,
						value: cleanedValue,
						quantity: itemQuantity,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
			}

			setItemName("");
			setItemValue("");
			setItemQuantity("");
			setModalVisible(false);
			setSelectedItemId(null);

			// Atualiza a lista de itens
			const response = await axios.get(
				`http://192.168.100.7:8000/api/shopping-lists/${listId}/products`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setItems(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleEditItem = (item) => {
		setSelectedItemId(item.id);
		setItemName(item.name);
		setItemValue(item.value.toString());
		setItemQuantity(item.quantity.toString());
		setModalVisible(true);
	};

	const handleDeleteItem = async (itemId) => {
		const token = await AsyncStorage.getItem("userToken");
		try {
			await axios.delete(`http://192.168.100.7:8000/api/products/${itemId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			// Atualiza a lista de itens após exclusão
			const response = await axios.get(
				`http://192.168.100.7:8000/api/shopping-lists/${listId}/products`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setItems(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCloseModal = () => {
		setItemName("");
		setItemValue("");
		setItemQuantity("");
		setSelectedItemId(null);
		setModalVisible(false);
	};

	const formatCurrency = (value) => {
		let newValue = value.replace(/\D/g, "");
		newValue = (newValue / 100).toFixed(2) + "";
		newValue = newValue.replace(".", ",");
		newValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		return newValue ? `R$ ${newValue}` : "";
	};

	return (
		<View style={styles.container}>
			{/* <CustomButton
				title="Adicionar Item"
				onPress={() => {
					setItemName("");
					setItemValue("");
					setItemQuantity("");
					setSelectedItemId(null);
					setModalVisible(true);
				}}
			/> */}
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handleEditItem(item)}>
						<ListItem data={item} onDelete={() => handleDeleteItem(item.id)} />
					</TouchableOpacity>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>

			<TouchableOpacity
				style={styles.floatingButton}
				onPress={() => setModalVisible(true)}
			>
				<View style={styles.floatingButtonContent}>
					<Icon name="add" size={24} color="#fff" />
					<Text style={styles.floatingButtonText}>Novo Item</Text>
				</View>
			</TouchableOpacity>

			<Modal
				visible={modalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={handleCloseModal}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<TextInput
							placeholder="Nome do Produto"
							value={itemName}
							onChangeText={setItemName}
							style={styles.input}
						/>
						{errorName ? (
							<Text style={styles.errorText}>{errorName}</Text>
						) : null}
						<TextInput
							placeholder="R$ 0,00"
							value={itemValue}
							onChangeText={(value) => setItemValue(formatCurrency(value))}
							keyboardType="numeric"
							style={styles.input}
						/>
						{errorValue ? (
							<Text style={styles.errorText}>{errorValue}</Text>
						) : null}
						<TextInput
							placeholder="Quantidade"
							value={itemQuantity}
							onChangeText={setItemQuantity}
							keyboardType="numeric"
							style={styles.input}
						/>
						{errorQuantity ? (
							<Text style={styles.errorText}>{errorQuantity}</Text>
						) : null}
						<View style={styles.modalButtons}>
							<View style={styles.buttonWrapper}>
								<CustomButton
									title={selectedItemId ? "Atualizar Item" : "Adicionar Item"}
									onPress={handleAddItem}
								/>
							</View>
							<View style={styles.buttonWrapper}>
								<CustomButton title="Cancelar" onPress={handleCloseModal} />
							</View>
						</View>
					</View>
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
	item: {
		marginBottom: 10,
	},
	modalContainer: {
		width: 300,
		padding: 20,
		backgroundColor: "#fff", // Fundo branco para o modal
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	input: {
		height: 40,
		width: "100%",
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
		backgroundColor: "#fff",
	},
	errorText: {
		color: "red",
		marginBottom: 10,
	},
	modalButtons: {
		flexDirection: "row",
		marginTop: 10,
	},
	buttonWrapper: {
		flex: 1,
		marginHorizontal: 5,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escuro semi-transparente
	},
	floatingButton: {
		position: "absolute",
		bottom: 45,
		right: 15,
		backgroundColor: "#4682B4",
		flexDirection: "row",
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 10,
		elevation: 4,
	},
	floatingButtonContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	floatingButtonText: {
		color: "#fff",
		fontSize: 16,
		marginLeft: 8,
	},
});

export default ListItemsScreen;
