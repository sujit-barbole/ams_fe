import React, { useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"; 
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../redux/userSlice'; // Ensure this is the correct path
import ShopHeader from "../components/ShopHeader";
import config from "../../config";

const LoginScreen = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation(); 
    const dispatch = useDispatch(); // Hook should be called here

    const handleLogin = async () => {
        if (!userName || !password) {
            Alert.alert("Error", "Please enter both user name and password.");
            return;
        }
    
        const requestBody = { userName, password };
        const requestUrl = config.API_URL+'/ams/v1/user/login';
        console.log("Login Request URL: ", requestUrl);
    
        // Log the request body
        console.log("Login Request Body:", JSON.stringify(requestBody));
        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.json();
    
            // Log the response
            console.log('Login Response:', JSON.stringify(data));
    
            if (response.ok) {
                // Handle successful login
                if (data.user.userStatus === 'Inactive' || data.user.userStatus === 'Blocked') {
                    Alert.alert(
                        "Error",
                        "Your profile is not active yet or blocked. Please wait till dealer's approval."
                    );
                    return; // Stop further execution
                }

                // Save user data to Redux
                dispatch(setUser(JSON.stringify(data)));

                // Save user data to AsyncStorage
                console.log("login user data in login page ::: ", JSON.stringify(data))
                await AsyncStorage.setItem('user', JSON.stringify(data));
                // Reset navigation stack to ensure HomeScreen is refreshed
                const storedData = await AsyncStorage.getItem('user');
                console.log("Stored user data in AsyncStorage: ", storedData);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
            } else {
                // Handle invalid login
                Alert.alert("Error", data.message || "Invalid user name or password.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
            console.error('Login error:', error);
        }
    };
    
    const handleSignUp = () => {
        navigation.navigate('Register'); // Navigate to SignUp screen
    };

    return (
        <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
           <ShopHeader/>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="User name"
                value={userName}
                onChangeText={setUserName}
                onSubmitEditing={Keyboard.dismiss}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onSubmitEditing={Keyboard.dismiss}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signupText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 100,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#3399ff',
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
    signupText: {
        textAlign: 'center',
        marginTop: 10,
    },
});
