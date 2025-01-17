import React, { useState, useEffect } from "react";
import {
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import ShopHeader from "../components/ShopHeader";
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import ImageResizer from 'react-native-image-resizer';
import config from "../../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBrandCategoryScreen = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [refreshBrands, setRefreshBrands] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            const storedUserData = await AsyncStorage.getItem('user');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                console.log("AddBrandCategoryScreen user data ::: ", parsedUserData.user);
                console.log("setting userData in state...")
                setUserData(parsedUserData.user);
            }
        };

        loadUserData();
    }, []);




    useEffect(() => {
        const fetchBrandsAndCategories = async () => {

            if (!userData || !userData.userId) return;
            try {
                const requestUrl = config.API_URL + '/ams/v1/user/product/brands/' + userData.userId;
                console.log("Fetch All Brands and categories Url ::: "+ requestUrl);
                const response = await fetch(requestUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Fetch All Brands and categories Response ::: "+ JSON.stringify(response));
                setBrands(data);
            } catch (error) {
                console.error('Error fetching brands and categories:', error);
                Alert.alert("Error", "Failed to load brands and categories.");
            }
        };

        fetchBrandsAndCategories();
    }, [userData, refreshBrands]);

    const resetFields = () => {
        setName('');
        setCategory('');
    };

    const brandItems = brands.map(brand => ({
        label: brand.name,
        value: brand.id, // You can use the brand ID for further operations
    }));

    const handleAddBrand = async () => {
        if (!name) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const requestBody = {
            name,
            dealerId: config.DEALER_UID
        };
        const requestUrl = config.API_URL+'/ams/v1/user/brand';
        console.log("Add brand Request URL ::: ", requestUrl);
        console.log("Add brand Request Body ::: ", requestBody)
        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            console.log("Add brand Response ::: ", response)
            if (response.ok) {
                Alert.alert("Brand Added Successfully", "", [{ text: "OK", onPress: resetFields }]);
                console.log("Calling fetchBrandsAndCategories after adding new brand..")
                setRefreshBrands(true);
            } else {
                Alert.alert("Error", data.message || "Failed to add Brand");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };


    const handleAddCategory = async () => {
        if (!category || !selectedBrand) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
    
        const requestBody = {
            name: category,
            dealerId: userData.userId,
            brandId: selectedBrand,
        };
        const requestUrl = config.API_URL + '/ams/v1/user/category';
        console.log("Add category Request URL: ", requestUrl);
        console.log("Add category Request Body: ", requestBody);
    
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
                Alert.alert("Category Added Successfully", "", [{ text: "OK", onPress: resetFields }]);
            } else {
                Alert.alert("Error", data.message || "Failed to add category");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };
    

    // const brandItems = Object.keys(brandsWithSubcategories).map(brand => ({ label: brand, value: brand }));
    // const categoryItems = brand ? 
    //     (brandsWithSubcategories[brand] || []).map(category => ({ label: category, value: category })) : 
    //     [];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.innerContainer}>
                <ShopHeader />
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Add Brand</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                        style={styles.input}
                        placeholder="Brand Name"
                        value={name}
                        onChangeText={setName}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleAddBrand}>
                        <Text style={styles.buttonText}>Add Brand</Text>
                    </TouchableOpacity>
                </ScrollView>
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Add Category</Text>
                    {/* <View style={styles.inputWrapper}>
                        <RNPickerSelect
                            onValueChange={setBrand}
                            items={brandItems}
                            placeholder={{ label: 'Select a Brand', value: null }}
                            style={pickerSelectStyles}
                        />
                    </View> */}
                    <View style={styles.inputWrapper}>
     <RNPickerSelect
        onValueChange={setSelectedBrand}
        items={brandItems}
        placeholder={{ label: 'Select a Brand', value: null }}
        style={pickerSelectStyles}
    />
</View>

                    <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Category Name"
                        value={category}
                        onChangeText={setCategory}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
                        <Text style={styles.buttonText}>Add Category</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

export default AddBrandCategoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        padding: 20,
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
    inputWrapper: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 50,
        paddingHorizontal: 10,
        color: 'black',
        paddingTop: 12,
        paddingBottom: 12,
    },
    inputAndroid: {
        height: 50,
        paddingHorizontal: 10,
        color: 'black',
        paddingTop: 12,
        paddingBottom: 12,
    },
    placeholder: {
        color: '#999',
    },
});
