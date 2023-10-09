import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const StopByTwoScreen = ({ navigation }) => {
    useEffect(() => {
        (async () => {
            const locate = await checkLocation();
            navigation.navigate(`${locate}`);
        })();
        
    }, [])
    // async function navigateToPage(){
    //         const locate = await checkLocation();
    //         navigation.navigate(`${locate}`);
    // }
    async function checkLocation() {
        const jsonValue = await AsyncStorage.getItem('location');
        const location = jsonValue != null ? JSON.parse(jsonValue) : null;
        var locate = "";

        if (location !== null) {
            // console.log(location);
            if (location.locate === "checkout") {
                locate = "Checkout";
            } else if (location.locate === "profile") {
                locate = "ViewProfile";
            } else if (location.locate === "review") {
                locate = "Review";
            }

        }

        return locate;
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 18, color: "#7C9070", fontWeight: "bold" }}>Success</Text>
            {/* <TouchableOpacity style={{ backgroundColor: "#7C9070", marginTop: 10, width: 150, height: 50, alignItems: "center", justifyContent: "center" }} onPress={navigateToPage}>
                <Text style={{ fontSize: 16, color: "#FFFEF5", fontWeight: "bold" }}>
                    Proceed
                </Text>
            </TouchableOpacity> */}
        </View>
    )
}

export default StopByTwoScreen

const styles = StyleSheet.create({
    container: {
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