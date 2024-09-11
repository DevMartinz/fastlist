import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import Main from "./src/views/main";
// import Information from "./src/views/informations/";
import ShoppingList from "./src/views/ShoppingList";
import ListItemsScreen from "./src/views/ListItemsScreen";
import LoginScreen from "./src/views/LoginScreen";
import RegisterScreen from "./src/views/register/RegisterScreen";
import SplashScreen from "./src/views/SplashScreen";

const Stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Splash"
					component={SplashScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Login"
					component={LoginScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="Register" component={RegisterScreen} />
				<Stack.Screen name="ShoppingList" component={ShoppingList} />
				<Stack.Screen name="ListItemsScreen" component={ListItemsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
