import React from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import config from "../../config";

const PendingApprovalsScreen = ({ route }) => {
    const { data } = route.params; // Get the data from the route params
    const navigation = useNavigation();

    const handleApprove = async (userId, dealerId) => {
        try {
            const requestUrl = `${config.API_URL}/ams/v1/user/${userId}/${dealerId}`;
            console.log("approve user url: "+ requestUrl);
            const response = await fetch(requestUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                Alert.alert("Success", "User approved successfully.");
                // Optionally refresh the list or navigate back
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "Failed to approve user.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
            console.error('Approval error:', error);
        }
    };

    const handleReject = async (userId) => {
        try {
            const requestUrl = `${config.API_URL}/ams/v1/user/deactivate/${userId}`;
            console.log("approve user url: "+ requestUrl);
            const response = await fetch(requestUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                Alert.alert("Success", "User rejected successfully.");
                // Optionally refresh the list or navigate back
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "Failed to reject user.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
            console.error('Rejection error:', error);
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
             <TouchableOpacity style={styles.button} onPress={() => handleReject(item.userId)}>
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleApprove(item.userId, '958b2a2e-04f8-43ec-95af-5972bee3fcd4')}>
                    <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Pending Approvals</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

export default PendingApprovalsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f7fa',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 20,
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    userInfo: {
        fontSize: 14,
        color: '#666',
        marginVertical: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#3399ff',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
