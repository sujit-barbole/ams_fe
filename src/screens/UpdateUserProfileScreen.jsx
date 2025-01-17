import React, { useState, useEffect } from "react";
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native"; 
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import config from "../../config";

const UpdateUserProfileScreen = () => {
    const loggedInUserData = useSelector((state) => state.user);
    const userData = loggedInUserData.user;
    const navigation = useNavigation();
    console.log("user data in updateuserprofile screen ::::: ", userData);
    // Initialize state with user data
    const [name, setName] = useState(userData.name);
    const [userName, setUserName] = useState(userData.userName);
    const [phone, setPhone] = useState(userData.phone);
    const [street, setStreet] = useState(userData.address.street);
    const [city, setCity] = useState(userData.address.city);
    const [state, setState] = useState(userData.address.state);
    const [pinCode, setPinCode] = useState(userData.address.pinCode);
    const [email, setEmail] = useState(userData.email);
    const [role, setRole] = useState('Retailer');
    const [dealerId, setDealerId] = useState(userData.userId);

    const handleUpdate = async () => {
        if (!name || !phone || !userName || !street || !city || !state || !pinCode || !email) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const sanitizedEmail = email.replace('\u0000', '');
    
        const requestBody = {
            name,
            phone,
            userName,
            address: {
                street,
                city,
                state,
                pinCode,
            },
            email: sanitizedEmail,
            role,
            dealerId,
        };
        const userId = userData.userId;
        const requestUrl = config.API_URL+'/ams/v1/user/update/'+ userId;
        console.log("Update profile Request URL: ", requestUrl);
        console.log("Update profile Request Body:", JSON.stringify(requestBody));
        try {
            const response = await fetch(requestUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.json();
            console.log("updateuserprofile screen response :::::", data);
            if (response.ok) {
                Alert.alert(
                    "Update Successful",
                    "Please wait till dealer's approval.",
                    [{ text: "OK", onPress: () => navigation.navigate('Home') }]
                );
            } else {
                Alert.alert("Error", data.message || "Update failed.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
            console.error('Update error:', error);
        }
    };        

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
            <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.innerContainer}>
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Update Profile</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={userName}
                        onChangeText={setUserName}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Street"
                        value={street}
                        onChangeText={setStreet}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="State"
                            value={state}
                            onChangeText={setState}
                            onSubmitEditing={Keyboard.dismiss}
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="City"
                            value={city}
                            onChangeText={setCity}
                            onSubmitEditing={Keyboard.dismiss}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Pin Code"
                        value={pinCode}
                        onChangeText={setPinCode}
                        keyboardType="numeric"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="numeric"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

export default UpdateUserProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        padding: 20,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    halfInput: {
        flex: 1,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#007bff',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});
