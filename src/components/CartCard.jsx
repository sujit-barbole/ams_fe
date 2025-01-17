import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import config from "../../config";

const CartCard = ({ product, productQuantity, onQuantityChange }) => {
    const loggedInUserData = useSelector((state) => state.user);
    console.log("loggedInUserDetails in productCard ::: ", loggedInUserData);
    const userData = loggedInUserData.user;
    
    const navigation = useNavigation();
    const [quantity, setQuantity] = useState(productQuantity || 0);

    const handleAdd = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange(product.productId, newQuantity);  // Pass updated quantity to parent
    };

    const handleRemove = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange(product.productId, newQuantity);  // Pass updated quantity to parent
        }
    };

    const handleRemoveFromCart = async () => {
        if (!userData) {
            Alert.alert(
                "Login Required",
                "Please log in before adding items to your cart.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('Auth', { screen: 'Login' }), // Updated line
                    }
                ]
            );
            return;
        }

        if (quantity > 0) {
            try {
                const requestBody = {
                    userId: userData.userId,
                    productId: product.productId,
                    quantity: quantity,
                    action: 'REMOVE'
                };
                const requestUrl = config.API_URL+'/ams/v1/user/cart/remove';
                console.log("Remove Product from cart Request URL: ", requestUrl);
                console.log("Remove Product from cart Request Body:", requestBody);
                const response = await fetch(requestUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
                
                if (response.ok) {
                    Alert.alert(
                        `Removed ${quantity} ${product.name} from cart`,
                        '',
                        [
                            {
                                text: "OK",
                                onPress: () => setQuantity(0),
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        "Error",
                        "Failed to remove from cart.",
                        [
                            {
                                text: "OK",
                                onPress: () => setQuantity(0),
                            }
                        ]
                    );
                }
            } catch (error) {
                Alert.alert(
                    "Error",
                    "Something went wrong. Please try again.",
                    [
                        {
                            text: "OK",
                            onPress: () => setQuantity(0),
                        }
                    ]
                );
                console.error('Remove Product from cart error:', error);
            }
        } else {
            Alert.alert("Please select a quantity");
        }
    };    

    return (
        <View style={styles.container}>
            <Image source={{ uri: `data:image/png;base64,${product.image}` }} style={styles.cardImage} />
            <View style={styles.productContent}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={handleRemove} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity onPress={handleAdd} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity onPress={handleRemoveFromCart} style={styles.handleRemoveFromCartButton}>
                    <Text style={styles.addToCartText}>Remove Product</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

export default CartCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 20,
    },
    cardImage: {
        height: 150, // Adjusted height for a better appearance
        borderRadius: 10,
        width: "90%",
        marginVertical: 5,
    },
    productTitle: {
        fontSize: 16,
        color: "#444444",
        fontWeight: "600",
        textAlign: 'center',
    },
    productDescription: {
        fontSize: 10,
        color: "#777777",
        fontWeight: "600",
        textAlign: 'center',
    },
    productContent: {
        padding: 5,
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    quantityButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
    },
    quantityButtonText: {
        fontSize: 15,
        color: '#007bff',
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    handleRemoveFromCartButton: {
        backgroundColor: '#fe5050',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginTop: 2,
    },
    addToCartText: {
        color: 'white',
        fontSize: 12,
    },
});
