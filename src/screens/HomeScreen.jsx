import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, TextInput, View, ActivityIndicator, TouchableOpacity, Text, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Entypo from 'react-native-vector-icons/Entypo';
import ProductCard from "../components/ProductCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import config from "../../config";

const HomeScreen = () => {
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const loadUserData = async () => {
            const storedUserData = await AsyncStorage.getItem('user');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData.user);
                dispatch(setUser(parsedUserData));
            }
        };

        loadUserData();
    }, [dispatch]);

    useEffect(() => {
        const fetchBrandsAndCategories = async () => {
            if (!userData) return;
            setLoading(true);
            try {
                const requestUrl = `${config.API_URL}/ams/v1/user/product/brands/${config.DEALER_UID}`;
                const response = await fetch(requestUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBrands(data);
            } catch (error) {
                setError('Failed to load brands and categories. Please try again later.');
            }
        };

        fetchBrandsAndCategories();
    }, [userData]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!userData) return;
            setLoading(true);
            try {
                const requestUrl = `${config.API_URL}/ams/v1/user/product/${config.DEALER_UID}`;
                const response = await fetch(requestUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [userData]);

    const handleBrandPress = (brand) => {
        setSelectedBrand(selectedBrand && selectedBrand.id === brand.id ? null : brand);
        setSelectedCategory(null);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (searchQuery) {
            return matchesSearchQuery;
        } else if (selectedBrand && selectedCategory) {
            return product.brand.name === selectedBrand.name && product.category.name === selectedCategory;
        }
        return true;
    });

    const renderBrand = ({ item }) => (
        <View key={item.id}>
            <TouchableOpacity onPress={() => handleBrandPress(item)} style={styles.brandButton}>
                <Text style={styles.brandText}>{item.name}</Text>
            </TouchableOpacity>
            {selectedBrand === item && (
                <View style={styles.categoryDropdown}>
                    {item.categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
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

    const renderProduct = ({ item }) => <ProductCard item={item} />;

    return (
        <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
            {loading ? (
                <View style={styles.loaderOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <ScrollView style={styles.contentContainer}>
                    {/* Search Bar */}
                    <View style={styles.inputContainer}>
                        <Entypo name="magnifying-glass" size={26} color="#C0C0C0" />
                        <TextInput
                            style={styles.input}
                            placeholder="Search Here .."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Horizontal Brands */}
                    <FlatList
                        data={brands}
                        renderItem={renderBrand}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.brandContainer}
                    />

                    {/* Product Listing */}
                    <FlatList
                        data={filteredProducts}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.productContainer}
                        showsVerticalScrollIndicator={false}
                    />
                </ScrollView>
            )}

            {/* Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 10,
    },
    contentContainer: {
        flex: 1,
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
    input: {
        flex: 1,
        height: 36,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    brandContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    brandButton: {
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
        alignItems: 'center',
        width: 100,
    },
    brandText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    errorContainer: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    errorText: {
        color: '#721c24',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    categoryDropdown: {
        backgroundColor: '#ffffff',
        padding: 7,
        borderRadius: 12,
        elevation: 2,
        marginTop: 5,
    },
    categoryButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginBottom: 2,
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 12,
        color: '#333',
    },
    selectedCategory: {
        backgroundColor: '#d0e1ff',
    },
    productContainer: {
        flexGrow: 1, // Allow products to expand
    },
});

export default HomeScreen;
