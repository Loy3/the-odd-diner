import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import subImg from "../assets/Images/1.jpg";
import backBtnIcon from "../assets/Icons/prev.png";
import cartIcon from "../assets/Icons/cart.png";
import moneyIcon from "../assets/Icons/money.png";
import prepTimeIcon from "../assets/Icons/stopwatch2.png";
const ViewItemScreen = ({ navigation }) => {

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
            await getItem().then(async () => {
                await getUser()
                // await addToCart()
                // setStoreItems(res);
                setloadingStatusStatus(false)
            })
        })();

    }, [])

    const [btnStatus, setBtnStatus] = useState(true);
    useEffect(() => {
        (async () => {
            const jsonValue = await AsyncStorage.getItem('cartItems');
            const res = jsonValue != null ? JSON.parse(jsonValue) : null;
            // console.log(res);
            const curItem = await getItemId();
            // console.log(curItem);

            //Get user 
            const jsonUserValue = await AsyncStorage.getItem('user');
            const resUser = jsonValue != null ? JSON.parse(jsonUserValue) : null;

            res.forEach(r => {
                if (r.id === curItem.id && r.userID === resUser.localId) {
                    console.log("found");
                    setBtnStatus(false);
                } else {
                    console.log("not found");
                }
            });

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
            emailAddress: res.email,
            userID: res.localId
        });
        // return null;
    }

    async function getItem() {
        const res = await getItems();

        // console.log("Res", res[0]);
        const itemId = await getItemId();
        // console.log(itemId);
        const myItem = null;
        res.forEach(r => {
            if (r.id === itemId.id) {
                setItem({
                    id: r.id,
                    itemImageUrl: r.itemImageUrl.stringValue,
                    itemName: r.itemName.stringValue,
                    itemSub: r.itemSub.stringValue,
                    itemPrepTime: r.itemPrepTime.stringValue,
                    itemPrice: r.itemPrice.stringValue,
                    itemDescription: r.itemDescription.stringValue
                })
            }
        });

        setItems(res);

    }

    async function getItemId() {
        const jsonValue = await AsyncStorage.getItem('itemId');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;

        return res;
    }


    function backToHome() {

        navigation.navigate("Home");
    }

    async function addToCart(id) {
        const jsonValue = await AsyncStorage.getItem('cartItems');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // await AsyncStorage.removeItem('cartItems')

        console.log("res", res);
        var itemsToCart = [];
        var itemId = {
            id: id,
            userID: signedInUser.userID
        }

        if (res === null) {
            // res.forEach(r => {
            //     itemsToCart.push(r);
            // });
            console.log("itemsToCart before", itemsToCart);
            itemsToCart.push(itemId);
            console.log("itemsToCart after", itemsToCart);
            const jsonSetValue = JSON.stringify(itemsToCart);
            await AsyncStorage.setItem('cartItems', jsonSetValue).then(() => {
                console.log("Success 1");
                setBtnStatus(false);
            })
        } else {
            res.forEach(r => {
                itemsToCart.push(r);
            });
            console.log("itemsToCart before", itemsToCart);
            itemsToCart.push(itemId);
            console.log("itemsToCart after", itemsToCart);
            const jsonSetValue = JSON.stringify(itemsToCart);
            await AsyncStorage.setItem('cartItems', jsonSetValue).then(() => {
                console.log("Success 1");
                setBtnStatus(false);
            })
        }


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
                        <View style={styles.mainImageCont}>
                            <Image source={item.itemImageUrl ? { uri: item.itemImageUrl } : subImg} style={styles.mainImage} />
                            {/* <Text>Hello</Text> */}
                            {/* {console.log("item", item)} */}
                            <TouchableOpacity style={styles.backBtnCont} onPress={backToHome}>
                                <Image source={backBtnIcon} style={styles.backBtn} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cartBtnCont} onPress={() => navigation.navigate("Cart")}>
                                <Image source={cartIcon} style={styles.cartBtn} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginHorizontal: 20, paddingVertical: 20 }}>
                            <Text style={styles.itemTitle}>{item.itemName ? `${item.itemName}` : "Title"}</Text>
                            <Text style={styles.itemSubTitle}>{item.itemName ? `${item.itemSub}` : "Sub Title"}</Text>

                            <View style={styles.cardPrepTimeCont}>
                                <Image source={prepTimeIcon} style={styles.cardPrepTimeIc} />
                                <Text style={styles.cardPrepTimeText}>{item.itemPrepTime ? `${item.itemPrepTime}` : "10 - 15 min"}</Text>
                            </View>

                            <Text style={styles.itemDescip}>
                                {item.itemDescription ? `${item.itemDescription}` : "none"}
                            </Text>

                            <View style={styles.cardPrepTimeCont}>
                                <Image source={moneyIcon} style={styles.cardPrepTimeIc} />
                                <Text style={styles.cardPrepTimeText}>{item.itemPrice ? `R${item.itemPrice}.00` : "R00.00"}</Text>
                            </View>

                            {btnStatus ?
                                <TouchableOpacity style={styles.siBtn} onPress={() => addToCart(item.id)}>
                                    {/* <TouchableOpacity style={styles.siBtn}  onPress={() => navigation.navigate("Journals")}> */}
                                    <Text style={styles.siBtnTxt}>Add to cart</Text>
                                </TouchableOpacity>
                                :
                                <View style={styles.altBtn} onPress={() => addToCart(item.id)}>
                                    {/* <TouchableOpacity style={styles.siBtn}  onPress={() => navigation.navigate("Journals")}> */}
                                    <Text style={styles.altBtnTxt}>Item already added to cart</Text>
                                </View>
                            }
                        </View>
                    </View>
                </>
            </ScrollView>
        </View>
    )
}

export default ViewItemScreen

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
        position: "absolute",
        top: 50,
        left: 15,
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
    itemSubTitle: {
        fontSize: 20,
        color: "#A8C099",
        fontWeight: "bold",
        // marginLeft: 10,
        marginTop: 5
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