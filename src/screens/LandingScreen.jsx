import React from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import LinearGradient  from "react-native-linear-gradient";

const LandingScreen = () => {
    return (
      <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
      <Text style={styles.container}>
        Welcome To Bharadiya Agencies !!
      </Text>
    </LinearGradient>
    )
}

export default LandingScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
})