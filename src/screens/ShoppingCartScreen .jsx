import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import CartCard from '../components/CartCard';
import config from "../../config";
import { useNavigation } from '@react-navigation/native';  // Import the hook

const ShoppingCartScreen = ({ route }) => {
    const navigation = useNavigation();  // Initialize the navigation hook
    const loggedInUserData = useSelector((state) => state.user);
    console.log("loggedInUserDetails in shopping cart screen ::: ", loggedInUserData);
    const userData = loggedInUserData.user;
    const { data } = route.params; // Destructure the data from route.params
    const [cartItems, setCartItems] = useState(data.cartLineItems);

    console.log("data in shopping cart screen: ", JSON.stringify(data.userId, null, 2)); // Log the data for debugging

    // Update the cartItem quantity when it's changed
    const updateCartQuantity = (productId, newQuantity) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.product.productId === productId) {
                if (newQuantity === 0) {
                    return null;  // Remove item if quantity is 0
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item !== null);  // Remove any null (removed) items

        setCartItems(updatedCartItems);  // Update the cartItems state
    };

    // Render cart item
    const renderItem = ({ item }) => {
        return <CartCard 
            product={item.product} 
            productQuantity={item.quantity} 
            onQuantityChange={updateCartQuantity}  // Pass the update function
        />;
    };

    const placeOrderButton = async () => {
        console.log("place order button clicked");
        if (!cartItems || cartItems.length === 0) {
            Alert.alert("No Product Selected", "Your cart is empty.");
            return;
        }
    
         // Generate orderItems dynamically from updated cartItems
         const orderItems = cartItems.filter(item => item.quantity > 0).map(item => ({
            productId: item.product.productId,
            quantity: item.quantity,
        }));
    
        console.log("Order Items: ", JSON.stringify(orderItems));

        if (orderItems.length === 0) {
            Alert.alert("No Products to Order", "All items in the cart have a quantity of 0.");
            return;
        }
    
        try {
            console.log("user data:", JSON.stringify(userData));
            const requestBody = {
                retailerId: userData.userId,
                dealerId: config.DEALER_UID,
                orderItems
            };   
    
            const requestUrl = `${config.API_URL}/ams/v1/user/order/add`;
            console.log("place order from shopping cart Request URL: ", requestUrl);
            console.log("place order from shopping cart Request Body:", requestBody);
    
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            // Log the raw response text first
            const responseText = await response.text();  // Read the response as text
            console.log("Raw response text:", responseText);
    
            // Display the response directly since it's plain text
            if (response.ok) {
                setCartItems([]);
                Alert.alert("Success", responseText);
            } else {
                Alert.alert("Error", `Failed to place order: ${responseText}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Cart</Text>
            
            {/* Check if cartItems has any items */}
            {cartItems && cartItems.length > 0 ? (
                <>
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
                </>
            ) : (
                <View style={styles.emptyCartMessageContainer}>
    <Text style={styles.emptyCartMessage}>No products in cart</Text>
    {/* View Products button to redirect to homepage */}
    <TouchableOpacity 
        style={styles.viewProductsButton} 
        onPress={() => navigation.navigate('Home')}  // Redirect to homepage
    >
        <Text style={styles.viewProductsText}>Add Products</Text>
    </TouchableOpacity>
</View>

            )}
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
    emptyCartMessageContainer: {
        backgroundColor: '#f8f9fa',  // Light gray background to make it feel clean and modern
        paddingVertical: 30,
        paddingHorizontal: 25,
        borderRadius: 15,  // Rounded corners for the container
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,  // Adjust to place lower on the screen
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0', // Light border to add separation
        shadowColor: '#000',  // Adding subtle shadow effect for better depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,  // Shadow effect for Android
    },
    emptyCartMessage: {
        fontSize: 18,
        fontWeight: '600',  // Slightly bold text for more emphasis
        color: '#555',  // Darker text color for readability
        textAlign: 'center',
        marginBottom: 20,  // Spacing between message and button
    },
    // Styles for View Products button
    viewProductsButton: {
        backgroundColor: '#007bff',  // Use a bright, eye-catching blue for the button
        borderRadius: 25,  // Rounded corners for a more modern look
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 10,
        elevation: 2,  // Subtle shadow for the button
    },
    viewProductsText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',  // Bold text for button text
        textAlign: 'center', // Center text inside the button
    },
});

export default ShoppingCartScreen;
