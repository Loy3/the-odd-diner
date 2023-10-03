import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';

import backBtnIcon from "../assets/Icons/prev.png";
import masterCardIcon from "../assets/Icons/card.png";
import cardChipIcon from "../assets/Icons/card.png";
import locationIcon from "../assets/Icons/location2.png";
import UpdateAddressComp from './UpdateAddressComp';

const CheckOutScreen = ({ navigation }) => {
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
    });
    const [items, setItems] = useState([]);
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [popUpStatus, setpopUpStatus] = useState(false)
    // useEffect(()=>{
    //     navigation.navigate("Cart")
    // },[])

    useEffect(() => {
        (async () => {
            setloadingStatusStatus(true);
            await getUser().then(async (user) => {

                // console.log(res);
                if (user === null) {
                    navigation.navigate("Home")
                } else {
                    await getCheckoutItems();
                }
                setloadingStatusStatus(false);
            })
        })();

    }, [])

    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("Ress", user[0]);
        const user = await getUsers(res.localId)
        // console.log("signed in user", user[0].address.mapValue.fields.zipCode.stringValue);
        const address = await getAddressonSave();
        if (address === null) {
            setSignedInUser({
                firstname: user[0].firstname.stringValue,
                lastname: user[0].lastname.stringValue,
                imageUrl: user[0].imageUrl.stringValue,
                emailAddress: res.email,
                userID: res.localId,
                address: `${user[0].address.mapValue.fields.streetAddr.stringValue} `,
                addressZip: `${user[0].address.mapValue.fields.zipCode.stringValue}`,
                city: `${user[0].address.mapValue.fields.city.stringValue}`
            });
        } else {
            setSignedInUser({
                firstname: user[0].firstname.stringValue,
                lastname: user[0].lastname.stringValue,
                imageUrl: user[0].imageUrl.stringValue,
                emailAddress: res.email,
                userID: res.localId,
                address: `${address.streetAddr} `,
                addressZip: `${address.zipCode}`,
                city: `${address.city}`
            });
        }

        return res;
    }

    async function getCheckoutItems() {
        const jsonValue = await AsyncStorage.getItem('checkout');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("Ress", res.items[0]);
    }


    async function getAddressonSave() {
        var myAddress = null;
        const address = await getAddress();
        if (address !== null) {
            const addDets = {
                streetAddr: address.streetAddr,
                city: address.city,
                zipCode: address.zipCode
            };
            // console.log(addDets);
            myAddress = address;
        } else {
            myAddress = null;
        }

        return myAddress;
    }

    async function getAddress() {
        const jsonValue = await AsyncStorage.getItem('physicalAddress');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }



    function backToHome() {
        navigation.navigate("Cart");
    }

    function editAddress() {
        setpopUpStatus(true)
    }

    if (loadingStatus === true) {
        return (
            <>
                <View style={styles.loadingScreen}>
                    <Text style={{ fontSize: 18, color: "#7C9070", fontWeight: "bold" }}>Loading...</Text>
                </View>
            </>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView scrollEnabled={true} >
                <>
                    <View>
                        <TouchableOpacity style={styles.backBtnCont} onPress={backToHome}>
                            <Image source={backBtnIcon} style={styles.backBtn} />
                        </TouchableOpacity>
                        <Text style={styles.pageTitle}>Checkout</Text>

                        <Text style={[styles.paymentTitle, { marginTop: 80 }]}>Delivery Address:</Text>

                        <View style={styles.addressCont}>
                            <Image source={locationIcon} style={styles.backBtn} />
                            <View>
                                <Text style={styles.addressTxtMain}>{signedInUser.address}</Text>
                                <Text style={styles.addressTxtMain}>{signedInUser.city}</Text>
                                <Text style={styles.addressTxtMain}>{signedInUser.addressZip}</Text>
                            </View>

                            <TouchableOpacity style={styles.editBtn} onPress={editAddress}>
                                <Text style={styles.editBtnTxt}>Edit</Text>
                            </TouchableOpacity>
                        </View>



                        <Text style={styles.paymentTitle}>Payment Method</Text>
                        <View style={styles.masterCardCont}>

                        </View>
                    </View>

                </>
            </ScrollView>
            {popUpStatus ?
                <View style={styles.popUp}>
                    <View style={styles.popUpBox}>
                        <UpdateAddressComp setpopUpStatus={setpopUpStatus} />
                    </View>
                </View>
                : null}
        </View>
    )
}

export default CheckOutScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: '#FFFEF5',
        width: "100%",
    },
    backBtnCont: {
        // position: "absolute",
        // top: 50,
        // left: 15,
        marginTop: 50,
        marginLeft: 15,
        backgroundColor: "#FFFEF5",
        width: 50,
        height: 50,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    backBtn: {
        width: 25,
        height: 25,
        marginLeft: -2
    },
    pageTitle: {
        position: "absolute",
        top: 50,
        right: 20,
        fontSize: 40,
        fontWeight: "bold",
        color: "#7C9070"
    },
    paymentTitle: {
        marginTop: 50,
        marginLeft: 20,
        fontSize: 21,
        fontWeight: "bold",
        color: "#7C9070"
    },
    masterCardCont: {
        marginTop: 20,
        width: "94%",
        height: 300,
        marginHorizontal: "3%",
        backgroundColor: "black",

    },
    addressCont: {
        marginHorizontal: 20,
        marginTop: 10,
        flexDirection: "row"
    },
    addressTxtMain: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#969696",
        marginLeft: 7
    },
    addressTxt: {
        fontSize: 17,
        // fontWeight: "bold",
        color: "#969696",
        marginLeft: 7
    },
    editBtn: {
        position: "absolute",
        right: 0,
        top: -35,
        width: 80,
        height: 40,
        backgroundColor: "#FFFEF5",
        borderColor: "#7C9070",
        borderWidth: 3,
        alignItems: "center",
        justifyContent: "center"
    },
    editBtnTxt: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#7C9070",
        marginLeft: 7,
    },





    popUp: {
        backgroundColor: "rgba(0,0,0,0.8)",
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
    popUpBox: {
        backgroundColor: "#FFFEF5",
        width: "90%",
        height: "auto",
        marginHorizontal: "5%",
    },
    loadingScreen: {
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

    },
})