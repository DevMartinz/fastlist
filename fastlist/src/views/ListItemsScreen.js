import React, { useEffect, useState } from "react";
import {
	View,
	FlatList,
	Text,
	Button,
	TextInput,
	StyleSheet,
	Modal,
	TouchableOpacity, // para usar no item
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../components/ListItem"; // Importe o componente ListItem

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

		// Se algum campo estiver vazio, não envia os dados
		if (hasError) {
			return;
		}

		const token = await AsyncStorage.getItem("userToken");

		// Remove o prefixo 'R$' e os pontos do valor antes de enviar para o backend
		const cleanedValue = itemValue
			.replace("R$ ", "")
			.replace(/\./g, "")
			.replace(",", ".");

		try {
			if (selectedItemId) {
				// Se um item foi selecionado, estamos editando
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
				// Se nenhum item foi selecionado, estamos adicionando um novo
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

			// Limpa os campos e fecha o modal após o envio
			setItemName("");
			setItemValue("");
			setItemQuantity("");
			setModalVisible(false);
			setSelectedItemId(null);

			// Refresh items
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

			// Atualizar a lista de itens após a exclusão
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
		setItemName(""); // Limpa o campo de nome
		setItemValue(""); // Limpa o campo de valor
		setItemQuantity(""); // Limpa o campo de quantidade
		setSelectedItemId(null); // Remove o ID selecionado
		setModalVisible(false); // Fecha o modal
	};

	const formatCurrency = (value) => {
		let newValue = value.replace(/\D/g, ""); // Remove qualquer caractere que não seja dígito
		newValue = (newValue / 100).toFixed(2) + ""; // Divide por 100 para adicionar duas casas decimais
		newValue = newValue.replace(".", ","); // Troca o ponto por vírgula
		newValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona o ponto como separador de milhar
		return newValue ? `R$ ${newValue}` : ""; // Adiciona o prefixo 'R$' se houver valor
	};

	return (
		<View style={styles.container}>
			<Button
				title="Add Item"
				onPress={() => {
					setItemName("");
					setItemValue("");
					setItemQuantity("");
					setSelectedItemId(null); // Remove qualquer item selecionado
					setModalVisible(true);
				}}
			/>
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handleEditItem(item)}>
						<ListItem data={item} onDelete={() => handleDeleteItem(item.id)} />
					</TouchableOpacity>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>

			<Modal
				visible={modalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={handleCloseModal}
			>
				<View style={styles.modalContainer}>
					<TextInput
						placeholder="Nome do Produto"
						value={itemName}
						onChangeText={setItemName}
						style={styles.input}
					/>
					{errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}
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
					<Button
						title={selectedItemId ? "Update Item" : "Add Item"}
						onPress={handleAddItem}
					/>
					<Button title="Cancel" onPress={handleCloseModal} />
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
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	input: {
		height: 40,
		width: 300,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
		backgroundColor: "#fff",
	},
});

export default ListItemsScreen;
