import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CartCard from '../components/CartCard';
import config from "../../config";

const ShoppingCartScreen = ({ route }) => {
    const userData = useSelector((state) => state.user);
    const { data } = route.params; // Destructure the data from route.params
    const cartItems = data.cartLineItems;

    console.log("data in shopping cart screen: ", JSON.stringify(data.userId, null, 2)); // Log the data for debugging

    const renderItem = ({ item }) => {
        return <CartCard product={item.product} productQuantity={item.quantity} />;
    };

    const placeOrderButton = async () => {
        console.log("place order button clicked");
        if (!cartItems || cartItems.length === 0) {
            Alert.alert("No Product Selected", "Your cart is empty.");
            return;
        }
    
        // Prepare the order data with products and quantities
        const orderItems = cartItems.map(item => ({
            productId: item.product.productId,
            quantity: item.quantity,
        }));
    
        console.log("Order Items: ", JSON.stringify(orderItems));
    
        try {
            console.log("user data:", JSON.stringify(userData));
            const requestBody = {
                retailerId: userData.userId,
                dealerId: userData.userId,
                orderItems
            };   
    
            const requestUrl = `${config.API_URL}/ams/v1/user/order/add`;
            console.log("Add to cart Request URL: ", requestUrl);
            console.log("Add to cart Request Body:", requestBody);
    
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            // Parse response body
            const responseBody = await response.json();
    
            if (response.ok) {
                Alert.alert("Order Placed Successfully!!");
            } else {
                Alert.alert("Error", `Failed to place order: ${responseBody.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Cart</Text>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.product.productId}
                numColumns={2} // Display two products per row
                contentContainerStyle={styles.productContainer}
                showsVerticalScrollIndicator={false}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={placeOrderButton} style={styles.placeOrderButton}>
                    <Text style={styles.placeOrderText}>Confirm and Place Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    productContainer: {
        flexGrow: 1, // Allows FlatList to take full space and be scrollable
        justifyContent: 'space-between',
        paddingBottom: 20, // Add some padding at the bottom
    },
    buttonContainer: {
        alignItems: 'center', // Center the button container
        marginTop: 10,
    },
    placeOrderButton: {
        backgroundColor: '#3399ff',
        borderRadius: 5,
        padding: 10,
        width: '60%', // Adjust width as needed
    },
    placeOrderText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center', // Center text inside button
    },
});

export default ShoppingCartScreen;