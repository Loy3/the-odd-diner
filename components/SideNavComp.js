import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';
import { getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import userIcon from "../assets/Icons/user2.png";

import homeIcon from "../assets/Icons/home.png";
import ordersIcon from "../assets/Icons/order.png";
import cartIcon from "../assets/Icons/cart.png";
import profileIcon from "../assets/Icons/user2.png";
import signOutIcon from "../assets/Icons/exit.png";

import closeIcon from "../assets/Icons/close.png";
import { useNavigation } from '@react-navigation/native';

const SideNavComp = ({ setMenuStatus }) => {
    const navigation = useNavigation();
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

    function handleNav(type) {
        switch (type) {
            case "home":
                navigation.navigate("Home");
                setMenuStatus(false);
                break;
            case "orders":
                // navigation.navigate("Home");
                setMenuStatus(false);
                console.log("Orders");
                break;
            case "cart":
                navigation.navigate("Cart");
                setMenuStatus(false);
                break;
            case "profile":
                navigation.navigate("ViewProfile");
                setMenuStatus(false);
                console.log("Profile");
                break;
            default:
                console.log("Sign Out");
        }
    }

    function closeMenu() {
        setMenuStatus(false);
    }
    return (
        <View style={styles.sideNavCont}>
            <View style={styles.sideNavBox}>

                <View style={styles.sideNavUser}>
                    <TouchableOpacity onPress={closeMenu} style={{ width: 30, height: 30, position: "absolute", top: 50, right: 10 }}>
                        <Image source={closeIcon} style={{ width: 15, height: 15 }} />
                    </TouchableOpacity>
                    <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
                    <Text style={styles.headerUser}>{`${signedInUser.firstname === null ? "First Name" : signedInUser.firstname} ${signedInUser.lastname === null ? "Last Name" : signedInUser.lastname}`}</Text>
                    <Text style={styles.headerDate}>{`${signedInUser.emailAddress === null ? "Email Address" : signedInUser.emailAddress}`}</Text>
                </View>
                <View style={styles.btnCont}>
                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => handleNav("home")}>
                        <Image source={homeIcon} style={styles.btnIcon} />
                        <Text style={styles.btnTxt}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => handleNav("orders")}>
                        <Image source={ordersIcon} style={styles.btnIcon} />
                        <Text style={styles.btnTxt}>Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => handleNav("cart")}>
                        <Image source={cartIcon} style={styles.btnIcon} />
                        <Text style={styles.btnTxt}>Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => handleNav("profile")}>
                        <Image source={profileIcon} style={styles.btnIcon} />
                        <Text style={styles.btnTxt}>Profile</Text>
                    </TouchableOpacity>


                </View>
                <TouchableOpacity style={{ flexDirection: "row", position: "absolute", bottom: 30, left: 30 }} onPress={() => handleNav("signOut")}>
                    <Image source={signOutIcon} style={styles.btnIcon} />
                    <Text style={[styles.btnTxt, { color: "#B60000" }]}>Sign Out</Text>
                </TouchableOpacity>
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
        width: "88%",
        zIndex: 99,
        top: 0,
        left: 0,

    },
    sideNavUser: {
        backgroundColor: "#A8C099",
        // opacity: 0.5,
        // position: "absolute",
        height: "31%",
        width: "100%",
        zIndex: 99,
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center"
    },

    headerDate: {
        color: "#FFFEF5",
        fontSize: 18,
        fontWeight: "400",
        marginBottom: 5
    },
    headerUser: {
        color: "#FFFEF5",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 1,
        marginTop: 20
    },
    headerImageCont: {
        position: 'absolute',
        top: 80,
        right: 20,

    },
    headerImage: {
        marginTop: 60,
        width: 100,
        height: 100,
        objectFit: "cover",
        borderRadius: 100,
        borderWidth: 3,
        borderColor: "#FFFEF5"
    },
    btnCont: {
        marginTop: 50,
        marginLeft: 30
    },
    btnIcon: {
        width: 35,
        height: 35,
        marginBottom: 20
    },
    btnTxt: {
        color: "#7C9070",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 10,
        marginTop: 5
    },

})