import React from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ShopHeader from "../components/ShopHeader";
import config from "../../config";

const UserProfileScreen = () => {
    const userLoginDetails = useSelector((state) => state.user);
    let userData = null;
    if (userLoginDetails) {
        userData = userLoginDetails.user;
    }
    console.log("user data in profile pagge::: ", userData);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    if (!userData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const handleUpdateUser = () => navigation.navigate('UpdateUserProfile'); 
    const handleUpdatePassword = () => navigation.navigate('UpdateUserPassword'); 
    const handleAddProduct = () => navigation.navigate('AddNewProduct'); 
    const handleAddBrandCategory = () => navigation.navigate('AddBrandCategory');
    const handlePendingOrders = () => handleOrders("PENDING");
    const handleDeliveredOrders = () => handleOrders("DELIVERED");
    const handleOrders = async (status) => {
        try {
            const requestUrl = `${config.API_URL}/ams/v1/user/order/${userData.userId}`;
            const requestBody = [status];
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            console.log("API Request: ", JSON.stringify(requestBody));
            const data = await response.json();
            console.log("API Response: ", data);

            if (!response.ok) {
                const data = await response.json();
                Alert.alert("Error", data.message || "Failed to fetch orders.");
                return;
            }
            console.log("sending data to pending order screen for: ", status ," orders");
            navigation.navigate('PendingOrders', { data });
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    const handlePendingApprovals = async () => {
        try {
            const requestUrl = `${config.API_URL}/ams/v1/user/${userData.userId}/retailers/pending`;
            const response = await fetch(requestUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            const data = await response.json();

            if (response.ok) {
                navigation.navigate('PendingApprovals', { data });
            } else {
                Alert.alert("Error", "Failed to fetch pending approvals.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <ShopHeader />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Profile Details</Text>
                </View>
                <View style={styles.profileContainer}>
                    <Entypo name={"user"} size={80} color="#888" />
                    <Text style={styles.userName}>{userData.name}</Text>
                    <Text style={styles.userInfo}>User Name: {userData.userName}</Text>
                    <Text style={styles.userInfo}>Phone: {userData.phone}</Text>
                    <Text style={styles.userInfo}>Email: {userData.email}</Text>
                    <View style={styles.addressContainer}>
                        <Text style={styles.addressTitle}>Address:</Text>
                        <Text style={styles.addressInfo}>Street: {userData.address.street}</Text>
                        <Text style={styles.addressInfo}>City: {userData.address.city}</Text>
                        <Text style={styles.addressInfo}>State: {userData.address.state}</Text>
                        <Text style={styles.addressInfo}>Pin Code: {userData.address.pinCode}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
                            <Text style={styles.buttonTextOne}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
                            <Text style={styles.buttonTextOne}>Update Profile</Text>
                        </TouchableOpacity>
                    </View>

                    {userData.role === 'Dealer' && (
                        <View style={styles.buttonContainerDealer}>
                            <TouchableOpacity style={styles.button} onPress={handlePendingOrders}>
                                <Text style={styles.buttonTextOne}>Pending Orders</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleDeliveredOrders}>
                                <Text style={styles.buttonTextOne}>Delivered Orders</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handlePendingApprovals}>
                                <Text style={styles.buttonTextOne}>Pending Approvals</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {userData.role === 'Dealer' && (
                        <View style={styles.buttonContainerDealer}>
                            <TouchableOpacity style={styles.button} onPress={handleAddBrandCategory}>
                                <Text style={styles.buttonText}>Add Brand</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                                <Text style={styles.buttonText}>Add Product</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f7fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#ffffff',
        padding: 25,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        width: '100%',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#444',
        marginVertical: 10,
    },
    userInfo: {
        fontSize: 16,
        color: '#555',
        marginVertical: 3,
    },
    addressContainer: {
        marginTop: 15,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#e0f7fa',
        borderWidth: 1,
        borderColor: '#b2ebf2',
        width: '100%',
    },
    addressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    addressInfo: {
        fontSize: 16,
        color: '#555',
        marginVertical: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '80%',
    },
    buttonContainerDealer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    button: {
        backgroundColor: '#3399ff',
        paddingVertical: 13,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 3,
        alignItems: 'center',
        elevation: 3,
    },
    buttonTextOne: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 9,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});