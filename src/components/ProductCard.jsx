import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import config from "../../config";

const ProductCard = ({ item }) => {
    const userData = useSelector((state) => state.user);
    const navigation = useNavigation();
    const [quantity, setQuantity] = useState(0);

    const handleAdd = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleRemove = () => {
        if (quantity > 0) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleAddToCart = async () => {
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
                    productId: item.id,
                    quantity: quantity,
                    action: 'ADD'
                };
                const requestUrl = config.API_URL+'/ams/v1/user/cart/add'
                console.log("add to cart url: ", requestUrl);
                console.log("add to cart Request: ", requestBody);
                const response = await fetch(requestUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
                
                if (response.ok) {
                    Alert.alert(
                        `Added ${quantity} ${item.name} to cart`,
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
                        "Failed to add to cart.",
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
                console.error('Add to cart error:', error);
            }
        } else {
            Alert.alert("Please select a quantity");
        }
    };    

    return (
        <View style={styles.container}>
          <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.cardImage} />
            <View style={styles.productContent}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription}>{item.description}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={handleRemove} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity onPress={handleAdd} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductCard;

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
    productName: {
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
    addToCartButton: {
        backgroundColor: '#3399ff',
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
