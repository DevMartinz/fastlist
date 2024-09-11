import React, { useEffect, useState } from "react";
import {
	View,
	FlatList,
	Text,
	Button,
	TextInput,
	StyleSheet,
	Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListItemsScreen = ({ route }) => {
	const { listId } = route.params;
	const [items, setItems] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [itemName, setItemName] = useState("");
	const [itemValue, setItemValue] = useState("");
	const [itemQuantity, setItemQuantity] = useState("");

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
		const token = await AsyncStorage.getItem("userToken");
		try {
			await axios.post(
				`http://192.168.100.7:8000/api/shopping-lists/${listId}/products`,
				{
					name: itemName,
					value: itemValue,
					quantity: itemQuantity,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setItemName("");
			setItemValue("");
			setItemQuantity("");
			setModalVisible(false);
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

	return (
		<View style={styles.container}>
			<Button title="Add Item" onPress={() => setModalVisible(true)} />
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<View style={styles.item}>
						<Text>Name: {item.name}</Text>
						<Text>Value: {item.value}</Text>
						<Text>Quantity: {item.quantity}</Text>
					</View>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>

			<Modal
				visible={modalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<TextInput
						placeholder="Item Name"
						value={itemName}
						onChangeText={setItemName}
						style={styles.input}
					/>
					<TextInput
						placeholder="Value"
						value={itemValue}
						onChangeText={setItemValue}
						keyboardType="numeric"
						style={styles.input}
					/>
					<TextInput
						placeholder="Quantity"
						value={itemQuantity}
						onChangeText={setItemQuantity}
						keyboardType="numeric"
						style={styles.input}
					/>
					<Button title="Add Item" onPress={handleAddItem} />
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
