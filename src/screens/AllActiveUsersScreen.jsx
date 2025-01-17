import React from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import config from "../../config";

const AllActiveUsersScreen = ({ route }) => {
    const { data } = route.params; // Get the data from the route params
    const navigation = useNavigation();

    const handlePendingOrders = async (item) => {
        console.log("item in handlePendingOrders :::  ", item)
        try {
            const requestUrl = `${config.API_URL}/ams/v1/user/order/orders`;
            const requestBody = {
                userId: item.userId,
                role: item.role,
                orderStatuses: ["PENDING"]
             };
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            if (response.ok) {
                navigation.navigate('PendingOrders', { data });
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "Failed to get pending orders for user.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
            console.error('Failed to get pending orders for user error:', error);
        }
    };

    const handleDeliveredOrders = async (item) => {
        console.log("item in handleDeliveredOrders :::  ", item)
        try {
            const requestUrl = `${config.API_URL}/ams/v1/user/order/orders`;
            const requestBody = {
                userId: item.userId,
                role: item.role,
                orderStatuses: ["DELIVERED"]
             };
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            if (response.ok) {
                navigation.navigate('PendingOrders', { data });
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "Failed to get delivered orders for user.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
            console.error('Failed to get delivered orders for user error:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userInfo}>Phone: {item.phone}</Text>
            <Text style={styles.userInfo}>Email: {item.email}</Text>
            <Text style={styles.userInfo}>Status: {item.userStatus}</Text>
            <Text style={styles.userInfo}>Role: {item.role}</Text>
            <Text style={styles.userInfo}>Address: {item.address.street}, {item.address.city}, {item.address.state}, {item.address.pinCode}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleDeliveredOrders(item)}>
                    <Text style={styles.buttonText}>Delivered Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePendingOrders(item)}>
                    <Text style={styles.buttonText}>Pending Orders</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Active Users</Text>
            {data.length === 0 ? (
                <View style={styles.noOrdersContainer}>
                    <Text style={styles.noOrdersText}>No Active Retailer</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            )}
        </View>
    );
};

export default AllActiveUsersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e9ecef',
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 20,
        color: '#495057',
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    userName: {
        fontSize: 25,
        fontWeight: '500',
        color: '#212529',
        marginBottom: 10,
    },
    userInfo: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    noOrdersContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ced4da',
        shadowOpacity: 0.1,
        shadowColor: '#000',
        elevation: 3,
    },
    noOrdersText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#6c757d',
    },
});
