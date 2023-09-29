import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';
import { getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import userIcon from "../assets/Icons/user2.png";

import homeIcon from "../assets/Icons/user2.png";
import ordersIcon from "../assets/Icons/user2.png";
import cartIcon from "../assets/Icons/user2.png";
import profileIcon from "../assets/Icons/user2.png";
import signOutIcon from "../assets/Icons/user2.png";

const SideNavComp = () => {
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
    });
    useEffect(() => {
        (async () => {

            await getUser();
        })();

    }, [])

    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("Ress", user[0]);
        const user = await getUsers(res.localId)
        console.log("signed in user", user[0].lastname.stringValue);
        setSignedInUser({
            firstname: user[0].firstname.stringValue,
            lastname: user[0].lastname.stringValue,
            imageUrl: user[0].imageUrl.stringValue,
            emailAddress: res.email
        });
        // return null;
    }
    return (
        <View style={styles.sideNavCont}>
            <View style={styles.sideNavBox}>
                <View style={styles.sideNavUser}>
                    <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
                    <Text style={styles.headerUser}>{`Hello! ${signedInUser.firstname === null ? "First Name" : signedInUser.firstname} ${signedInUser.lastname === null ? "Last Name" : signedInUser.lastname}`}</Text>
                    <Text style={styles.headerDate}>{`${signedInUser.emailAddress === null ? "Email Address" : signedInUser.emailAddress}`}</Text>
                </View>
                <View style={styles.btnCont}>
                    <TouchableOpacity style={{ flexDirection: "row" }}>
                        <Image source={homeIcon} style={styles.btnIcon} />
                        <Text style={styles.btnTxt}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row" }}>
                        <Image source={homeIcon} style={styles.btnIcon} />
                        <Text style={styles.btnTxt}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row" }}>
                        <Image source={homeIcon} style={styles.btnIcon} />
                        <Text style={styles.btnTxt}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row" }}>
                        <Image source={homeIcon} style={styles.btnIcon} />
                        <Text style={styles.btnTxt}>Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default SideNavComp

const styles = StyleSheet.create({


    sideNavCont: {
        backgroundColor: "rgba(0,0,0,0.5)",
        // opacity: 0.5,
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 99,
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    sideNavBox: {
        backgroundColor: "#FFFEF5",
        // opacity: 0.5,
        position: "absolute",
        height: "100%",
        width: "85%",
        zIndex: 99,
        top: 0,
        left: 0,

    },
    sideNavUser: {
        backgroundColor: "#A8C099",
        // opacity: 0.5,
        // position: "absolute",
        height: "35%",
        width: "100%",
        zIndex: 99,
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center"
    },

    headerDate: {
        color: "#FFFEF5",
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 5
    },
    headerUser: {
        color: "#FFFEF5",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 5
    },
    headerImageCont: {
        position: 'absolute',
        top: 60,
        right: 20,

    },
    headerImage: {

        width: 100,
        height: 100,
        objectFit: "cover",
        borderRadius: 100,
        borderWidth: 3,
        borderColor: "#FFFEF5"
    },
    btnCont:{
        marginTop: 30,
        marginLeft: 20
    },
    btnIcon: {
        width: 40,
        height: 40,
        marginBottom: 20
    }

})