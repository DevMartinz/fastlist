import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress, color = "#4682B4" }) => {
	return (
		<TouchableOpacity
			style={[styles.button, { backgroundColor: color }]}
			onPress={onPress}
		>
			<Text style={styles.buttonText}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#4682B4",
		padding: 8,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 2,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default CustomButton;
