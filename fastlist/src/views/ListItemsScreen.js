import React, { useEffect, useState } from "react";
import {
	View,
	FlatList,
	Text,
	TextInput,
	StyleSheet,
	Modal,
	TouchableOpacity,
	Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../components/ListItem"; // Importe o componente ListItem
import CustomButton from "../components/CustomButton"; // Importe o CustomButton
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

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
	const [itemImage, setItemImage] = useState(null);

	useEffect(() => {
		const fetchItems = async () => {
			// Solicitar permissões para acessar a biblioteca de imagens
			const getPermissions = async () => {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== "granted") {
					alert(
						"Desculpe, precisamos de permissão para acessar a biblioteca de imagens."
					);
				}
			};
			getPermissions();
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

		const formData = new FormData();
		formData.append("name", itemName);
		formData.append(
			"value",
			itemValue.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
		);
		formData.append("quantity", itemQuantity);

		// Verifica se uma imagem foi selecionada
		if (itemImage) {
			formData.append("image", {
				uri: itemImage.uri,
				type: "image/jpeg" || "image/png" || "image/jpg", // Ajuste o tipo conforme necessário
				name: itemImage.uri.split("/").pop(), // Nome da imagem
			});
		}

		try {
			if (selectedItemId) {
				// Editando item
				await axios.put(
					`http://192.168.100.7:8000/api/products/${selectedItemId}`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "multipart/form-data",
						},
					}
				);
			} else {
				// Adicionando novo item
				await axios.post(
					`http://192.168.100.7:8000/api/shopping-lists/${listId}/products`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "multipart/form-data",
						},
					}
				);
			}

			setItemName("");
			setItemValue("");
			setItemQuantity("");
			setItemImage(null); // Limpa a imagem
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
		setItemImage({ uri: `http://192.168.100.7:8000/storage/${item.image}` }); // Defina a URL da imagem
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

	const handleSelectImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.canceled) {
				setItemImage(result.assets[0]); // Salva a imagem selecionada
			}
		} catch (error) {
			console.error("Erro ao selecionar imagem:", error);
		}
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
						<TouchableOpacity
							onPress={handleSelectImage}
							style={styles.imageButton}
						>
							<Text style={styles.imageButtonText}>
								{itemImage ? "Alterar Imagem" : "Selecionar Imagem"}
							</Text>
						</TouchableOpacity>

						{/* Exibe a imagem selecionada */}
						{itemImage && (
							<Image
								source={{ uri: itemImage.uri }}
								style={styles.previewImage}
							/>
						)}

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
	imageButton: {
		marginVertical: 10,
		backgroundColor: "#4682B4",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
	},
	imageButtonText: {
		color: "#fff",
		fontSize: 16,
	},
	previewImage: {
		width: 100,
		height: 100,
		marginVertical: 10,
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
