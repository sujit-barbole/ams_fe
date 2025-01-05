import React from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Category = ({item, selectedCategory, setSelectedCategory}) => {
    return (
        <TouchableOpacity onPress={()=> setSelectedCategory(item)}>
        <Text style = {[styles.categoryText, selectedCategory===item && 
            {color: "#FFFFFF",backgroundColor: "#87CEFA"},]}>{item}</Text>
    </TouchableOpacity>
            
    );
};

export default Category;

const styles = StyleSheet.create({
    categoryText: {
        fontSize: 16,
        fontWeight:"600",
        textAlign: "center",
        backgroundColor: "#DFDCDC",
        borderRadius: 16,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});