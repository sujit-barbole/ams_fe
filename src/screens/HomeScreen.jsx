import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, TextInput, View, ActivityIndicator, TouchableOpacity, Text, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Entypo from 'react-native-vector-icons/Entypo';
import ProductCard from "../components/ProductCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import ShopHeader from "../components/ShopHeader";
import config from "../../config";

const HomeScreen = () => {
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [loginData, setLoginData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    
    // fetching user data from store
    useEffect(() => {
        const loadUserData = async () => {
            const storedUserData = await AsyncStorage.getItem('user');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                console.log("parsed userdata :: ", parsedUserData);
                setUserData(parsedUserData); // Store user data in state
                dispatch(setUser(parsedUserData));
            }
        };

        loadUserData();
    }, [dispatch]);


    useEffect(() => {
        const fetchBrandsAndCategories = async () => {
            console.log("fetching brands and category:::::::", JSON.stringify(userData));
            if (!userData || !userData.user || !userData.user.userId) return;
            try {
                const requestUrl = config.API_URL + '/ams/v1/user/product/brands/' + (userData.dealerUID ? userData.dealerUID : userData.user.userId);
                console.log("Fetch All Brands and categories from Home Url: "+ requestUrl);
                const response = await fetch(requestUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBrands(data);
            } catch (error) {
                console.error('Error fetching brands and categories:', error);
                Alert.alert("Error", "Failed to load brands and categories.");
            }
        };

        fetchBrandsAndCategories();
    }, [userData]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!userData) return;
            setLoading(true);
            try {
                const requestUrl = config.API_URL+'/ams/v1/user/product/' + (userData.dealerUID ? userData.dealerUID : userData.userId);
                console.log("Request URL for fetching product: ", requestUrl);
                const response = await fetch(requestUrl);
                console.log("Response: ", response.ok)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("response product data size :", data.size);
                setProducts(data); // Set the fetched products
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchProducts();
    }, [userData]);

    const handleBrandPress = (brand) => {
        setSelectedBrand(selectedBrand && selectedBrand.id === brand.id ? null : brand); // Use entire brand object
        setSelectedCategory(null); // Reset selected category when brand changes
        setCategories(brand.categories); // Assuming the brand object contains categories
    };    

    const renderCategory = (category) => (
        <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === category.id && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category.name)}
        >
            <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
    );

    const renderBrand = ({ item }) => (
        <View key={item.id}>
            <TouchableOpacity onPress={() => handleBrandPress(item)} style={styles.brandButton}>
                <Text style={styles.brandText}>{item.name}</Text>
            </TouchableOpacity>
            {selectedBrand === item && (
                <View style={styles.categoryDropdown}>
                    {item.categories.map((category) => (
                        <TouchableOpacity
                            key={category.id} // Unique key for category
                            style={[styles.categoryButton, selectedCategory === category.id && styles.selectedCategory]}
                            onPress={() => setSelectedCategory(category.name)}
                        >
                            <Text style={styles.categoryText}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );  

    const renderProduct = ({ item }) => (
        <ProductCard item={item} />
    );

    const filteredProducts = products.filter(product => {
        const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()); 
      
        // Only filter based on the search query or both brand and category
        if (searchQuery) {
            return matchesSearchQuery; // Filter by search query only
        }  else if (selectedBrand && selectedCategory) {
            return product.brand.name === selectedBrand.name && product.category.name === selectedCategory; // Adjust this logic as per your data structure
        }  
        return true; // No filters applied, show all products
    });  
    

    return (
        <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
            {loading ? (
                <View style={styles.loaderOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    <ShopHeader />
                    {/* Search Bar */}
                    <View style={styles.inputContainer}>
                        <Entypo name={"magnifying-glass"} size={26} color={"#C0C0C0"} />
                        <TextInput 
    style={styles.input} 
    placeholder="Search Here .." 
    value={searchQuery} 
    onChangeText={setSearchQuery} // Update search query on text change
/>

                    </View>
                    <View>
    {/* Horizontal Scrollable Brands */}
    <FlatList
        data={brands}
        renderItem={renderBrand}
        keyExtractor={(item) => item.id.toString()}
        horizontal // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false} // Show horizontal scroll indicator
        contentContainerStyle={styles.brandContainer}
    />
</View>

                    {/* Product Listing */}
                    <FlatList
                        data={filteredProducts}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2} // Display two products per row
                        contentContainerStyle={styles.productContainer}
                        showsVerticalScrollIndicator={false} // Optional: hide vertical scroll indicator
                    />
                </View>
            )}
        </LinearGradient>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 10,
    },
    contentContainer: {
        flex: 1, // Allow content to take up available space
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        marginVertical: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowRadius: 4,
    },
    brandContainer: {
        flexDirection: 'row',
        paddingVertical:5,
        paddingHorizontal: 5, // Optional: Add some horizontal padding
    },
    input: {
        flex: 1,
        height: 36,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    productContainer: {
        flexGrow: 1, // Allows FlatList to take full space and be scrollable
        justifyContent: 'space-between',
        paddingBottom: 20, // Add some padding at the bottom
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject, // Fill the entire container
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: translucent background
        zIndex: 1, // Make sure it's above other components
    },
    brandButton: {
        padding: 7, // Add some padding
        marginHorizontal: 5, // Space between items
        backgroundColor: '#fff', // Background color
        borderRadius: 12, // Rounded corners
        elevation: 3, // Shadow effect
    },    
    categoryDropdown: {
        backgroundColor: '#f5f7fa', // Adjust background color as needed
        padding: 10, // Add some padding
        borderRadius: 12, // Rounded corners
        elevation: 2, // Optional shadow effect
        marginBottom: 10, // Space below the dropdown
    },
    brandButton: {
        padding: 10, // Increased padding for better touch area
        marginHorizontal: 2,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
        alignItems: 'center', // Center the text
        width: 100, // Fixed width for uniformity
    },
    brandText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333', // Darker color for better contrast
    },
    categoryDropdown: {
        backgroundColor: '#ffffff', // White background for contrast
        padding: 7,
        borderRadius: 12,
        elevation: 2,
        marginTop: 5, // Space between brand button and categories
        shadowColor: '#000', // Adding shadow for depth
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    categoryButton: {
        paddingVertical: 4, // Increased vertical padding
        paddingHorizontal: 12, // Horizontal padding for better touch area
        borderRadius: 8,
        backgroundColor: '#f0f0f0', // Light gray background for categories
        marginBottom: 2, // Space between categories
        alignItems: 'center', // Align text to start
    },
    categoryText: {
        fontSize: 12,
        color: '#333', // Darker text for better readability
    },
    selectedCategory: {
        backgroundColor: '#d0e1ff', // Light blue for selected category
    },
});