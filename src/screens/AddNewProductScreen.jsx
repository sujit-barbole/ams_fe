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

const AddNewProductScreen = () => {
    const navigation = useNavigation();
    const loggedInUserData = useSelector((state) => state.user);
    const userData = loggedInUserData.user;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [imageData, setImageData] = useState(null);
    const [image, setImage] = useState(null);
    const [dealerId, setDealerId] = useState(userData.userId);
    const [brands, setBrands] = useState([]);

    const resetFields = () => {
        setName('');
        setDescription('');
        setBrand('');
        setCategory('');
        setImageData(null);
        setImage(null);
    };
    useEffect(() => {
        const fetchBrandsAndCategories = async () => {
            const requestUrl = `${config.API_URL}/ams/v1/user/product/brands/${userData.userId}`;
            console.log("Fetch All Brands and categories in add new product Url: "+ requestUrl);
            try {
                const response = await fetch(requestUrl);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setBrands(data);
            } catch (error) {
                console.error('Error fetching brands:', error);
                Alert.alert("Error", "Failed to load brands.");
            }
        };

        fetchBrandsAndCategories();
    }, [userData]);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const selectedImage = response.assets[0];
                setImage(selectedImage);
                await resizeAndConvertImage(selectedImage.uri);
            }
        });
    };

    const resizeAndConvertImage = async (uri) => {
        try {
            // Resize the image
            const resizedImage = await ImageResizer.createResizedImage(uri, 800, 800, 'JPEG', 80);
            const base64String = await RNFS.readFile(resizedImage.uri, 'base64');
            setImageData(base64String);
        } catch (error) {
            console.error("Error resizing image: ", error);
            Alert.alert("Error", "Failed to resize and read image data.");
        }
    };

    const handleAddProduct = async () => {
        if (!name || !description || !brand || !category || !imageData) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        // Find selected brand and category names
    const selectedBrand = brands.find(b => b.id === brand);
    const selectedCategory = selectedBrand ? selectedBrand.categories.find(c => c.id === category) : null;

        const requestBody = {
            name,
            description,
            brand: selectedBrand ? selectedBrand.name : null,  // Use brand name
            category: selectedCategory ? selectedCategory.name : null,  // Use category name
            image: imageData,
            dealerId
        };
        const requestUrl = config.API_URL+'/ams/v1/user/product/add';
        console.log("Add new product Request URL: ", requestUrl);
        console.log("Base64 Image Size:", Buffer.byteLength(imageData, 'base64'));
        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            console.log("Add new product response ::: ", data);
            if (response.ok) {
                Alert.alert("Product Added Successfully", "", [{ text: "OK", onPress: resetFields }]);
            } else {
                Alert.alert("Error", data.message || "Failed to add product.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    const brandItems = brands.map(brand => ({ label: brand.name, value: brand.id }));
    const categoryItems = brand ? 
        (brands.find(b => b.id === brand)?.categories || []).map(cat => ({ label: cat.name, value: cat.id })) : 
        [];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.innerContainer}>
                <ShopHeader />
                <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Add Product</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Product name"
                        value={name}
                        onChangeText={setName}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Product Description"
                        value={description}
                        onChangeText={setDescription}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <View style={styles.inputWrapper}>
                        <RNPickerSelect
                            onValueChange={setBrand}
                            items={brandItems}
                            placeholder={{ label: 'Select a Brand', value: null }}
                            style={pickerSelectStyles}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <RNPickerSelect
                            onValueChange={setCategory}
                            items={categoryItems}
                            placeholder={{ label: 'Select a Category', value: null }}
                            style={pickerSelectStyles}
                            disabled={!brand}
                        />
                    </View>
                    <TouchableOpacity onPress={selectImage}>
                        <TextInput
                            style={styles.input}
                            placeholder="Product Image (Tap to select)"
                            value={image ? image.uri : ''}
                            editable={false}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                        <Text style={styles.buttonText}>Add Product</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

export default AddNewProductScreen;

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
