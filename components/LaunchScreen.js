
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import cover from "../assets/Icons/table.png";
const LaunchScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <View style={styles.topImg} >
                <Image source={cover} style={styles.landingImg} />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.titleCont}>
                    <Text style={styles.title}>The Odd Diner</Text>
                    <Text style={styles.subTitle}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                        1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </Text>
                </View>


            </View>
            <View style={styles.proceed}>
                <TouchableOpacity style={styles.proceedBTN}
                    onPress={() => navigation.navigate("SignIn")}>
                    <Text style={styles.proceedBtnTxt}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.proceedBTN}
                    onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.proceedBtnTxt}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LaunchScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF5',
        flex: 1,
        //     backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topImg: {
        width: "100%",
        height: "auto",
        alignItems: "center",
        position: "absolute",
        top: 50
    },
    landingImg: {
        width: 250,
        height: 250,
        marginTop: 50
    },
    // wrapper: {
    //     width: "100%",
    //     height: "50%",
    // },
    titleCont: {
        marginHorizontal: 25,
        marginTop: 80
    },
    title: {
        color: "#7C9070",
        width: "100",
        textAlign: "center",
        fontSize: 36,
        fontStyle: "normal",
        fontWeight: "bold",
        marginBottom: 15
    },
    subTitle: {
        // width: "90%",
        textAlign: "center",
        fontSize: 14
    },
    proceed: {
        position: "absolute",
        bottom: 40,
        width: "100%",
        // height: 150,
        // backgroundColor: "whitesmoke",
    },
    proceedBTN: {
        width: "90%",
        height: 70,
        borderRadius: 100,
        marginVertical: 5,
        marginHorizontal: "5%",
        backgroundColor: "#7C9070",
        alignItems: "center",
        justifyContent: "center"
    },
    proceedBtnTxt: {
        textAlign: "center",
        color: "#FFFEF5",
        paddingVertical: 15,
        fontSize: 15,
        fontWeight: "bold"
    },
})