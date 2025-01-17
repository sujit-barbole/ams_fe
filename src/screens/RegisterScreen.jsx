import React, { useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native"; 
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import ShopHeader from "../components/ShopHeader";
import config from "../../config";

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [role, setRole] = useState('Retailer');
    const [dealerId, setDealerId] = useState(config.DEALER_ID);

    const handleRegister = async () => {
        if (!name || !phone || !userName || !street || !city || !state || !pinCode || !email || !password || !confirmedPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
    
        if (password !== confirmedPassword) {
            Alert.alert("Error", "Passwords do not match.");
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
            password,
            confirmedPassword,
            role,
            dealerId,
        };
        const requestUrl = config.API_URL+'/ams/v1/user/register';
        console.log("Register Request URL: ", requestUrl);
        console.log("Register Request Body:", JSON.stringify(requestBody));
        console.log("dealerId: ", dealerId);
    
        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Alert.alert(
                    "Registration Successful",
                    "Please wait till dealer's approval.",
                    [{ text: "OK", onPress: () => navigation.navigate('Login') }]
                );
            } else {
                Alert.alert("Error", data.message || "Registration failed.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
            console.error('Registration error:', error);
        }
    };        

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
            <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.innerContainer}>
            {/* <ShopHeader /> */}
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Register</Text>
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
                        placeholder="Street Address"
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
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Re-enter Password"
                        value={confirmedPassword}
                        onChangeText={setConfirmedPassword}
                        secureTextEntry
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

export default RegisterScreen;

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
        marginTop: 20,
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
});
