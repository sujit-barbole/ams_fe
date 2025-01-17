import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const ShopHeader = () => {
    return (
        <View style={styles.headerContainer}>
            <Image
                source={require('../assets/bharadiyaAgencyLogo.png')} // Replace with your logo path
                style={styles.logo}
            />
            <Text style={styles.shopName}>Bharadiya Agency</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 70, // Adjust size as needed
        height: 70,
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
