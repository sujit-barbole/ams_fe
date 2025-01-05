import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const ShopHeader = () => {
    return (
        <View style={styles.headerContainer}>
            <Image
                source={require('../assets/demoImage.png')} // Replace with your logo path
                style={styles.logo}
            />
            <Text style={styles.shopName}>Your Shop Name</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 40, // Adjust size as needed
        height: 40,
        borderRadius: 50,
        marginRight: 10,
    },
    shopName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ShopHeader;
