import React, { useState, useEffect } from "react";
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native"; 
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import config from "../../config";

const UpdateUserPasswordScreen = () => {
    const loggedInUserData = useSelector((state) => state.user);
    const userData = loggedInUserData.user;
    console.log("updateUserPassword screen userdata :::::", userData);
    const navigation = useNavigation();
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const handleUpdate = async () => {
        if (!currentPassword || !password || !confirmedPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
    
        if (password !== confirmedPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
    
        const requestBody = {
            oldPassword: currentPassword,
            newPassword: password, // Sending the new password as the field for update
        };
        console.log("user data in updateuserpassword screen ::::: ", userData);
        const userId = userData.userId;
        const requestUrl = config.API_URL+'/ams/v1/user/changePassword/'+ userId;
        console.log("Update Password Request URL: ", requestUrl);
        console.log("Update Password Request Body:", JSON.stringify(requestBody));
        try {
            const response = await fetch(requestUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.text();
            console.log("updateuserpassword screen response :::::", data);
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
                    <Text style={styles.title}>Change Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Re-enter New Password"
                        value={confirmedPassword}
                        onChangeText={setConfirmedPassword}
                        secureTextEntry
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

export default UpdateUserPasswordScreen;

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
