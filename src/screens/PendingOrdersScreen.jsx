import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import config from "../../config";

const PendingOrdersScreen = ({ route }) => {
    const { data } = route.params;
    const [orders, setOrders] = useState(data); // Track orders in the state
    const [loading, setLoading] = useState(false);

    const handleDeclineOrder = async (dealerId, orderId) => {
        const confirmed = await confirmAction("decline");
        if (confirmed) {
            // Creating an update request body with the order status set to DECLINED (5)
            const updateRequest = {
                orderId: orderId,
                status: "DECLINED",  // DECLINED status corresponds to 5 in your enum
            };
    
            await markOrder(dealerId, updateRequest, orderId);
        }
    };

    const handleCompleteOrder = async (dealerId, orderId) => {
        const confirmed = await confirmAction("complete");
        if (confirmed) {
            // Creating an update request body with the order status set to DELIVERED (4)
            const updateRequest = {
                orderId: orderId,
                status: "DELIVERED",  // DELIVERED status corresponds to 4 in your enum
            };
    
            await markOrder(dealerId, updateRequest, orderId);
        }
    };
    
    const confirmAction = (action) => {
        return new Promise((resolve) => {
            Alert.alert(
                `Confirm ${action === "decline" ? "Decline" : "Completion"}`,
                `Are you sure you want to ${action} this order?`,
                [
                    { text: "No", onPress: () => resolve(false), style: "cancel" },
                    { text: "Yes", onPress: () => resolve(true) },
                ]
            );
        });
    };

    // Adjusted markOrder function to send the status as an integer and remove the order from the list
    const markOrder = async (dealerId, updateRequest, orderId) => {
        setLoading(true);
        try {
            const requestUrl = `${config.API_URL}/ams/v1/user/order/${dealerId}/`;  // Adjusting the endpoint according to the controller
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateRequest),  // Sending the full updateRequest body
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("API Request: ", JSON.stringify(updateRequest));
            const result = await response.json(); // Optional: If you need to handle the response data
            Alert.alert("Success", `Order ID ${updateRequest.orderId} has been updated.`);

            // Ensure that the state is correctly updated and the item is removed from the list
            setOrders(prevOrders => {
                return prevOrders.filter(order => order.orderId !== orderId);
            });
        } catch (error) {
            Alert.alert("Error", "There was a problem updating the order.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderOrderItem = ({ item }) => {
        const { orderDetails, retailer } = item;
        const { orderItems, orderStatus } = orderDetails;
        const retailerName = retailer.name;

        const showButtons = orderStatus === "PENDING"; 

        return (
            <View style={styles.orderItemContainer}>
                <Text style={styles.orderId}>{retailerName}</Text>
                <Text style={styles.orderStatus}>Status: {orderStatus}</Text>
                <Text style={styles.orderDate}>Created At: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</Text>
                <Text style={styles.orderItemsHeader}>Order Items:</Text>
                {orderItems.map((orderItem, index) => (
                    <View key={index} style={styles.orderItemRow}>
                        {/* Example placeholder for product image */}
                        <Image source={{ uri: `data:image/png;base64,${orderItem.product.image}` }} style={styles.productImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.productName}>{orderItem.product.name}</Text>
                            <Text style={styles.productQuantity}>Quantity: {orderItem.quantity}</Text>
                        </View>
                    </View>
                ))}
                {/* Conditionally render the buttons based on the order's status */}
                {showButtons && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleDeclineOrder(item.retailer.userId, item.orderId)} disabled={loading}>
                            <Text style={styles.buttonText}>Decline Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={() => handleCompleteOrder(item.retailer.userId, item.orderId)} disabled={loading}>
                            <Text style={styles.buttonText}>Complete Order</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {loading && <ActivityIndicator size="small" color="#007bff" style={styles.loadingIndicator} />}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pending Orders</Text>
            <FlatList
                data={orders}  // Use the updated orders state
                renderItem={renderOrderItem}
                keyExtractor={(item) => `${item.orderId}`} // Ensure unique key based on orderId
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default PendingOrdersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#343a40',
    },
    listContainer: {
        paddingBottom: 16,
    },
    orderItemContainer: {
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    orderId: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 4,
    },
    orderStatus: {
        fontSize: 16,
        color: 'green',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 10,
    },
    orderItemsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#495057',
    },
    orderItem: {
        fontSize: 14,
        marginLeft: 10,
        color: '#212529',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
    },
    completeButton: {
        backgroundColor: '#28a745',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    loadingIndicator: {
        marginTop: 10,
    },
    orderItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ced4da',
    },
    productImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
    itemDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
    },
    productQuantity: {
        fontSize: 14,
        color: '#6c757d',
    },
});
