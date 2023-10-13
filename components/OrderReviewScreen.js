import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';

import backBtnIcon from "../assets/Icons/prev.png";
import masterCardIcon from "../assets/Icons/card.png";
import cardChipIcon from "../assets/Icons/chip.png";
import priceIcon from "../assets/Icons/money.png";
import locationIcon from "../assets/Icons/location2.png";
import UpdateAddressComp from './UpdateAddressComp';
import UpdateCardDetailsComp from './UpdateCardDetailsComp';


import { CardField, useStripe } from '@stripe/stripe-react-native';


const OrderReviewScreen = ({ navigation }) => {
    const { confirmPaymentMethod } = useStripe();
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null,
        address: null,
        addressZip: null,
        city: null,
        cardName: null,
        cardNum: null,
        cardDate: null,
        zipCode: null
    });
    const [items, setItems] = useState([]);
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [popUpStatus, setpopUpStatus] = useState(false);
    const [popUpCardStatus, setpopUpCardStatus] = useState(false);
    const [itemsTotalPrice, setItemsTotalPrice] = useState("");
    const [itemsSubTotalPrice, setItemsSubTotalPrice] = useState("");
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [recAddress, setRecAddress] = useState({
        address: null,
        addressZip: null,
        city: null,
    })
    // useEffect(()=>{
    //     navigation.navigate("Cart")
    // },[])

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            setloadingStatusStatus(true);
            await getUser().then(async (user) => {

                // console.log(res);
                if (user === null) {
                    navigation.navigate("Cart")
                } else {
                    await getCheckoutItems();
                }
                setloadingStatusStatus(false);
            })
        })
        return unsubscribe
    }, [navigation])


    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("Ress", user[0]);
        const user = await getUsers(res.localId)
        // console.log("signed in user", user[0].cardDetails.mapValue.fields.cardDate.stringValue);
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
                city: `${user[0].address.mapValue.fields.city.stringValue}`,
                cardName: user[0].cardDetails.mapValue.fields.cardName.stringValue,
                cardNum: user[0].cardDetails.mapValue.fields.cardNum.stringValue,
                cardDate: user[0].cardDetails.mapValue.fields.cardDate.stringValue,
                zipCode: user[0].cardDetails.mapValue.fields.zipCode.stringValue
            });

            setRecAddress({
                address: `${user[0].address.mapValue.fields.streetAddr.stringValue} `,
                addressZip: `${user[0].address.mapValue.fields.zipCode.stringValue}`,
                city: `${user[0].address.mapValue.fields.city.stringValue}`,
            })
        } else {
            setSignedInUser({
                firstname: user[0].firstname.stringValue,
                lastname: user[0].lastname.stringValue,
                imageUrl: user[0].imageUrl.stringValue,
                emailAddress: res.email,
                userID: res.localId,
                address: `${address.streetAddr} `,
                addressZip: `${address.zipCode}`,
                city: `${address.city}`,
                cardName: user[0].cardDetails.mapValue.fields.cardName.stringValue,
                cardNum: user[0].cardDetails.mapValue.fields.cardNum.stringValue,
                cardDate: user[0].cardDetails.mapValue.fields.cardDate.stringValue,
                zipCode: user[0].cardDetails.mapValue.fields.zipCode.stringValue
            });

            setRecAddress({
                address: `${address.streetAddr} `,
                addressZip: `${address.zipCode}`,
                city: `${address.city}`,
            })
        }

        return res;
    }

    async function getCheckoutItems() {
        const jsonValue = await AsyncStorage.getItem('checkout');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("Ress", res.items);
        setItemsSubTotalPrice(res.itemsSubTotalPrice);
        setItemsTotalPrice(res.itemsTotalPrice)
        setCheckoutItems(res.items)
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
            console.log(addDets);
            myAddress = address;
        } else {
            myAddress = null;
        }

        return myAddress;
    }

    async function getAddress() {
        const jsonValue = await AsyncStorage.getItem('physicalAddress');
        console.log(jsonValue);

        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }



    function backToHome() {
        navigation.navigate("Cart");
    }

    async function editAddress() {
        const location = { locate: "review" };
        const jsonValue = JSON.stringify(location);
        await AsyncStorage.setItem('location', jsonValue).then(() => {
            console.log("Success");
            setpopUpStatus(true)
        })

    }

    function toCheckout() {
        // console.log("ch");
        navigation.navigate("Checkout")
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
            <View style={{
                height: 130,
                width: "100%",
                backgroundColor: "#7C9070"
            }}>
                <TouchableOpacity style={styles.backBtnCont} onPress={backToHome}>
                    <Image source={backBtnIcon} style={styles.backBtn} />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Review</Text>
            </View>
            <ScrollView scrollEnabled={true} >
                <>
                    <View >



                        <Text style={[styles.paymentTitle, { marginTop: 30 }]}>Delivery Address:</Text>

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

                        <View style={{ marginTop: 30 }}>
                            <Text style={[styles.paymentTitle, { marginTop: 30 }]}>Order Summary:</Text>

                            <View style={styles.cartCont}>
                                {checkoutItems.map((item, index) => (
                                    <View style={styles.cartCard} key={index}>
                                        <View style={styles.itemImgCont}>
                                            <Image source={item.itemImageUrl ? { uri: item.itemImageUrl } : subImg} style={styles.itemImg} />
                                        </View>
                                        <View style={styles.cardDetailsCont}>
                                            <Text style={styles.cardItemTitle}>{item.itemName ? `${item.itemName}` : "Title"}</Text>
                                            <Text style={styles.cardItemSubTitle}>{item.itemSub ? `${item.itemSub}` : "Sub Title"}</Text>
                                            <View style={styles.priceCont}>
                                                <Image source={priceIcon} style={styles.prepTimeIc} />
                                                <Text style={styles.prepTimeText}>{item.totalPrice ? `R${item.totalPrice}.00` : "R00.00"}</Text>
                                            </View>

                                        </View>
                                        <View style={[styles.countBtnCont, { position: "absolute", top: 15, right: 10 }]}>
                                            <Text style={styles.counter}>{item.numOfItems ? `${item.numOfItems}` : "1"}</Text>
                                        </View>
                                    </View>
                                ))}


                            </View>


                        </View>

                        <View style={styles.pricingCont}>
                            <Text style={styles.pricingTitle}>Pricing</Text>
                            <View style={{ flexDirection: "row", marginTop: 15 }}>
                                <Text style={styles.subTotalLeft}>Sub Total</Text>
                                <Text style={styles.subTotalRight}>R{itemsSubTotalPrice}.00</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <Text style={styles.subTotalLeft}>Delivery Fee:</Text>
                                <Text style={styles.subTotalRight}>R60.00</Text>
                            </View>
                            <View style={styles.pLine2} />
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.totalLeft}>Total</Text>
                                <Text style={styles.totalRight}>R{itemsTotalPrice}.00</Text>
                            </View>

                            {/* <TouchableOpacity style={styles.siBtn} >
                                <Text style={styles.siBtnTxt}>Confirm Payment</Text>
                            </TouchableOpacity> */}

                        </View>
                    </View>
                </>
            </ScrollView>
            <View style={styles.siBtnCont} >
                <TouchableOpacity style={styles.siBtn} onPress={toCheckout}>
                    <Text style={styles.siBtnTxt}>Checkout</Text>
                </TouchableOpacity>
            </View>

            {popUpStatus ?
                <View style={styles.popUp}>
                    <View style={styles.popUpBox}>
                        <UpdateAddressComp setpopUpStatus={setpopUpStatus} />
                    </View>
                </View>
                : null}
            {popUpCardStatus ?
                <View style={styles.popUp}>
                    <View style={styles.popUpBox}>
                        <UpdateCardDetailsComp setpopUpCardStatus={setpopUpCardStatus} />
                    </View>
                </View>
                : null}

        </View>
    )
}

export default OrderReviewScreen

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
        fontSize: 33,
        fontWeight: "bold",
        color: "#FFFEF5"
    },
    paymentTitle: {
        marginTop: 50,
        marginLeft: "5%",
        fontSize: 21,
        fontWeight: "bold",
        color: "#7C9070"
    },
    addressCont: {
        width: "90%",
        marginHorizontal: "5%",
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
    editBtn2: {
        position: "absolute",
        right: 20,
        top: 40,
        width: 80,
        height: 40,
        backgroundColor: "#FFFEF5",
        borderColor: "#7C9070",
        borderWidth: 3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
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
        justifyContent: "center",
        borderRadius: 8
    },
    editBtnTxt: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#7C9070",
        // marginLeft: 7,
    },
    editBtn3: {
        marginHorizontal: 5,
        width: 80,
        height: 40,
        backgroundColor: "#FFFEF5",
        borderColor: "#7C9070",
        borderWidth: 3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    },
    pLine: {
        width: "90%",
        marginHorizontal: "5%",
        borderWidth: 1,
        borderColor: "#7C9070",
        borderStyle: "dashed",
        marginVertical: 20,
        marginTop: 30
    },
    masterCardCont: {
        marginTop: 20,
        width: "90%",
        height: 250,
        marginHorizontal: "5%",
        backgroundColor: "#7C9070",
        borderRadius: 15

    },
    chip: {
        width: 40,
        height: 40,
        position: "absolute",
        top: 20,
        left: 20
    },
    cardMaster: {
        width: 64,
        height: 40,
        position: "absolute",
        right: 20,
        top: 20
    },
    cardNum: {
        width: "100%",
        textAlign: "center",
        marginTop: 110,
        fontSize: 18,
        // fontWeight: "bold",
        color: "#FFFEF5",
        letterSpacing: 7
    },
    cardDetailsCont: {
        position: "absolute",
        bottom: 20,
        left: 0,
        width: "100%",
        flexDirection: "row"
    },
    cardNameCont: {
        width: "40%",
        // alignItems: "flex-start",
        marginLeft: 20,
        justifyContent: "center"
    },
    cardRestCont: {
        width: "30%",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    cardTitles: {
        fontSize: 14,
        color: "#FFFEF5",
        textAlign: "left",
    },
    cardSubTitles: {
        fontSize: 14,
        color: "#FFFEF5",
        fontWeight: "bold"
    },

    pricingCont: {
        width: "90%",
        height: 200,
        marginHorizontal: "5%",
        // backgroundColor: "yellow",
        marginTop: 100,
        marginBottom: 20,
        position: "fixed",
        zIndex: 99,
        bottom: 0
    },
    pricingTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#7C9070",
        marginTop: 10
    },
    subTotalLeft: {
        width: "50%",
        textAlign: "left",
        fontSize: 16,
        fontWeight: "bold",
        color: "#969696"
    },
    subTotalRight: {
        width: "50%",
        textAlign: "right",
        fontSize: 16,
        fontWeight: "bold",
        color: "#969696"
    },
    pLine2: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#7C9070",
        borderStyle: "dashed",
        marginVertical: 20
    },
    totalLeft: {
        width: "50%",
        textAlign: "left",
        fontSize: 20,
        fontWeight: "bold",
        color: "#7C9070"
    },
    totalRight: {
        width: "50%",
        textAlign: "right",
        fontSize: 20,
        fontWeight: "bold",
        color: "#7C9070"
    },
    siBtnCont: {
        width: "90%",
        // height: 300,
        marginHorizontal: "5%",
        // backgroundColor: "yellow",
        // marginTop: 100,
        marginBottom: 20,
        position: "fixed",
        zIndex: 99,

        bottom: 0
    },
    siBtn: {
        width: "100%",
        // marginHorizontal: "8%",
        marginBottom: 0,
        height: 60,
        borderRadius: 50,
        // marginTop: 40,
        // marginHorizontal: "5%",
        backgroundColor: "#7C9070",
        alignItems: "center",
        justifyContent: "center",

    },
    siBtnTxt: {
        textAlign: "center",
        color: "#FFFEF5",
        paddingVertical: 15,
        fontSize: 17,
        fontWeight: "bold"
    },

    cartCont: {
        width: "90%",
        height: "auto",
        // backgroundColor: "yellow",
        marginHorizontal: "5%",
        marginTop: 5,
        marginBottom: 0
    },
    cartCard: {
        height: 105,
        width: "100%",
        // backgroundColor: "#E8F5E0",
        marginBottom: 10,
        // borderColor: "#7C9070",
        // borderWidth: 3,
        flexDirection: "row"
    },
    itemImgCont: {
        width: "25%",
        height: "94%",
        marginVertical: "3%"
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
        top: 5,
        right: 5
    },
    deleteButn: {
        height: 30,
        width: 30
    },
    numOfItemsCont: {
        flexDirection: "row",
        // backgroundColor: "yellow",
        width: 105,
        height: 35,
        position: "absolute",
        bottom: 5,
        right: 5
    },
    countBtnCont: {
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#7C9070",
        // borderRadius:100
    },
    countBtn: {
        width: 20,
        height: 20
    },
    counterCont: {
        height: 35,
        width: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFEF5"
    },
    counter: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFEF5"
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