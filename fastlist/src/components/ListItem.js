import React from "react";
import { TouchableOpacity, View, Button, Text, StyleSheet } from "react-native";

const ListItem = ({ data, onDelete }) => {
	return (
		<View style={styles.item}>
			<Text style={styles.itemP2}>x {data.quantity}</Text>
			<Text style={styles.itemP1}>{data.name}</Text>
			<Text style={styles.itemP2}>R$ {data.value}</Text>
			<Button title="Delete" onPress={onDelete} />
		</View>
	);
};

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		marginLeft: 30,
		marginRight: 30,
		borderBottomWidth: 1,
		borderBottomColor: "#a6a6a6",
		paddingVertical: 10,
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	itemInfo: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	itemP1: {
		fontSize: 15,
		color: "#000",
		marginBottom: 5,
	},
	itemP2: {
		fontSize: 15,
		color: "#999999",
	},
});

export default ListItem;
