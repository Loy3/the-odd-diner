import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const SignOutScreen = ({setSignIn}) => {
    useEffect(() => {
        // console.log("status");
        setSignIn(false)
    }, [])
  return (
    <View style={styles.container}>
        <Text style={{ fontSize: 18, color: "#7C9070", fontWeight: "bold" }}>Signing Out...</Text>
    </View>
  )
}

export default SignOutScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#FFFEF5",
        // opacity: 0.5,
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 99,
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center"
    }
})