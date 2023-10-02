import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';

import backBtnIcon from "../assets/Icons/prev.png";
import priceIcon from "../assets/Icons/money.png";
import deleteIcon from "../assets/Icons/delete.png";

const CartScreen = ({ navigation }) => {

    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
    });
    const [items, setItems] = useState([]);
    const [item, setItem] = useState({
        id: "",
        itemImageUrl: "",
        itemName: "",
        itemSub: "",
        itemPrepTime: "",
        itemPrice: "",
        itemDescription: ""
    });
    const [storeItems, setStoreItems] = useState([]);
    const [loadingStatus, setloadingStatusStatus] = useState(false);

    useEffect(() => {
        (async () => {
            setloadingStatusStatus(true);
            await getUser().then(async () => {
                const jsonValue = await AsyncStorage.getItem('cartItems');
                const res = jsonValue != null ? JSON.parse(jsonValue) : null;
                console.log(res);
                if (res === null) {
                    navigation.navigate("Home")
                } else {
                    await getCartItems(res);
                }
                setloadingStatusStatus(false)
            })
        })();

    }, [])

    const [btnStatus, setBtnStatus] = useState(true);
    // useEffect(() => {
    //     (async () => {

    //         // console.log(curItem);



    //     })();
    // }, [])


    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("Ress", user[0]);
        const user = await getUsers(res.localId)
        // console.log("signed in user", res.localId);
        setSignedInUser({
            firstname: user[0].firstname.stringValue,
            lastname: user[0].lastname.stringValue,
            imageUrl: user[0].imageUrl.stringValue,
            emailAddress: res.email,
            userID: res.localId
        });
        // return null;
    }

    async function getCartItems(itemsId) {
        const res = await getItems();
        //Get USer
        const jsonValue = await AsyncStorage.getItem('user');
        const resUser = jsonValue != null ? JSON.parse(jsonValue) : null;

        console.log("itemsId", itemsId);
        var myItems = [];
        itemsId.forEach(id => {
            res.forEach(r => {
                if (id.id === r.id && resUser.userID === r.userID) {
                    console.log("Item found");
                    const foundItem = {
                        id: r.id,
                        itemImageUrl: r.itemImageUrl.stringValue,
                        itemName: r.itemName.stringValue,
                        itemSub: r.itemSub.stringValue,
                        itemPrepTime: r.itemPrepTime.stringValue,
                        itemPrice: r.itemPrice.stringValue,
                        itemDescription: r.itemDescription.stringValue
                    }
                    myItems.push(foundItem);
                }
            });
            // console.log(myItems);

            // if (r.id === itemId.id) {
            //     setItem({
            //         id: r.id,
            //         itemImageUrl: r.itemImageUrl.stringValue,
            //         itemName: r.itemName.stringValue,
            //         itemSub: r.itemSub.stringValue,
            //         itemPrepTime: r.itemPrepTime.stringValue,
            //         itemPrice: r.itemPrice.stringValue,
            //         itemDescription: r.itemDescription.stringValue
            //     })
            // }
        });
        setItems(myItems);
        // setItems(res);

    }

    async function deleteFromCart(id) {
        const jsonValue = await AsyncStorage.getItem('cartItems');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;

        var remainingItems = [];
        res.forEach(r => {
            if (r.id === id && signedInUser.userID === r.userID) {
                console.log("Found the item");
            } else {
                remainingItems.push(r);
            }
        });

        // console.log("Remaining items", remainingItems);

        const jsonSetValue = JSON.stringify(remainingItems);
        await AsyncStorage.setItem('cartItems', jsonSetValue).then(async () => {
            console.log("Success");
            await getCartItems(remainingItems);
        })

    }

    function backToHome() {

        navigation.navigate("Home");
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
                        <Text style={styles.pageTitle}>Cart</Text>

                        <View style={styles.cartCont}>
                            {items.map((item, index) => (
                                <View style={styles.cartCard} key={index}>
                                    <View style={styles.itemImgCont}>
                                        <Image source={item.itemImageUrl ? { uri: item.itemImageUrl } : subImg} style={styles.itemImg} />
                                    </View>
                                    <View style={styles.cardDetailsCont}>
                                        <Text style={styles.cardItemTitle}>{item.itemName ? `${item.itemName}` : "Title"}</Text>
                                        <Text style={styles.cardItemSubTitle}>{item.itemSub ? `${item.itemSub}` : "Sub Title"}</Text>
                                        <View style={styles.priceCont}>
                                            <Image source={priceIcon} style={styles.prepTimeIc} />
                                            <Text style={styles.prepTimeText}>{`R${item.itemPrice}.00`}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={styles.deleteButnCont} onPress={() => deleteFromCart(item.id)}>
                                        <Image source={deleteIcon} style={styles.deleteButn} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                </>
            </ScrollView>
        </View>
    )


}

export default CartScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: '#FFFEF5',
        width: "100%",
    },
    mainImageCont: {
        position: "relative",
        width: "100%",
        // height: "50%",
        // paddingTop: 50,
        height: "auto",
        backgroundColor: "#7C9070",
    },
    mainImage: {
        width: "100%",
        height: 550,
        objectFit: "cover"
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
    cartCont: {
        width: "92%",
        height: "auto",
        // backgroundColor: "yellow",
        marginHorizontal: "4%",
        marginTop: 50
    },
    cartCard: {
        height: 140,
        width: "100%",
        backgroundColor: "#E8F5E0",
        marginBottom: 10,
        borderColor: "#7C9070",
        borderWidth: 3,
        flexDirection: "row"
    },
    itemImgCont: {
        width: "40%",
        height: "100%"
    },
    itemImg: {
        margin: "3%",
        width: "94%",
        height: "94%",
        objectFit: "cover"
    },
    cardDetailsCont: {
        margin: 5
    },
    cardItemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#7C9070",
        marginTop: 10
    },
    cardItemSubTitle: {
        fontSize: 12,
        // fontWeight:"bold",
        color: "#7C9070",
        marginTop: 3,
        marginLeft: 5
    },
    prepTimeIc: {
        width: 25,
        height: 25
    },
    prepTimeText: {
        marginLeft: 10,
        color: "#7C9070",
        fontSize: 16,
        fontWeight: "700",
    },
    priceCont: {
        // width: "30%",
        // backgroundColor:"green",
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    deleteButnCont: {
        position: "absolute",
        top: 10,
        right: 10
    },
    deleteButn: {
        height: 40,
        width: 40
    },


    cartBtnCont: {
        position: "absolute",
        top: 50,
        right: 15,
        backgroundColor: "#FFFEF5",
        width: 50,
        height: 50,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    cartBtn: {
        width: 25,
        height: 25,
        marginLeft: -2
    },

    itemTitle: {
        fontSize: 24,
        color: "#7C9070",
        fontWeight: "bold",
        // marginLeft: 10,
        marginTop: 0
    },

    cardPrepTimeCont: {
        marginTop: 20,
        marginLeft: -5,
        width: "50%",
        // backgroundColor:"yellow",
        flexDirection: "row",
        alignItems: "center",
    },
    cardPrepTimeIc: {
        width: 30,
        height: 30
    },
    cardPrepTimeText: {
        marginLeft: 5,
        color: "#7C9070",
        fontSize: 18,
        fontWeight: "700",
    },
    itemDescip: {
        marginTop: 20,
        fontSize: 14
    },
    siBtn: {
        width: "100%",
        // marginHorizontal: "8%",
        height: 60,
        borderRadius: 50,
        marginTop: 40,
        // marginHorizontal: "5%",
        backgroundColor: "#7C9070",
        alignItems: "center",
        justifyContent: "center"
    },
    siBtnTxt: {
        textAlign: "center",
        color: "#FFFEF5",
        paddingVertical: 15,
        fontSize: 17,
        fontWeight: "bold"
    },

    altBtn: {
        width: "100%",
        // marginHorizontal: "8%",
        height: 60,
        borderRadius: 50,
        marginTop: 40,
        // marginHorizontal: "5%",
        backgroundColor: "#E8F5E0",
        alignItems: "center",
        justifyContent: "center"
    },
    altBtnTxt: {
        textAlign: "center",
        color: "#7C9070",
        paddingVertical: 15,
        fontSize: 17,
        fontWeight: "bold"
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