import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';


const Header = () => {
    const userData = useSelector((state) => state.user);
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity 
                style={styles.userProfileIconContainer} 
                onPress={() => navigation.navigate('UserProfile')}
            >
                <Entypo name={"user"} size={30} />
            </TouchableOpacity>
             {userData && ( // Check if userData is non-null
                <View style={styles.menuIconContainer}>
                    <Entypo name={"shopping-cart"} size={30} />
                </View>
            )}
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
        zIndex: 1,
    },
    userProfileIconContainer: {
        backgroundColor: "#87CEFA",
        height: 44,
        width: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIconContainer: {
        backgroundColor: "#87CEFA",
        height: 44,
        width: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
