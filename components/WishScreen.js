import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';

import prepTimeIcon from "../assets/Icons/stopwatch2.png";
import masterCardIcon from "../assets/Icons/card.png";
import cardChipIcon from "../assets/Icons/chip.png";
import closeIcon from "../assets/Icons/close.png";
import subImg from "../assets/Images/1.jpg";

import menuIcon from "../assets/Icons/menu.png";
import userIcon from "../assets/Icons/user2.png";
import priceIcon from "../assets/Icons/money.png";
import wishIcon from "../assets/Icons/favourite.png";
import UpdateAddressComp from './UpdateAddressComp';
import UpdateCardDetailsComp from './UpdateCardDetailsComp';
import deleteIcon from "../assets/Icons/delete.png";

import { CardField, useStripe } from '@stripe/stripe-react-native';
import SideNavComp from './SideNavComp';


const WishScreen = ({ navigation }) => {
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null,

    });
    const [items, setItems] = useState([]);
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [popUpStatus, setpopUpStatus] = useState(false);
    const [popUpCardStatus, setpopUpCardStatus] = useState(false);
    const [itemsTotalPrice, setItemsTotalPrice] = useState("");
    const [itemsSubTotalPrice, setItemsSubTotalPrice] = useState("");
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [orderViewStatus, setorderViewStatus] = useState(false);
    const [menuStatus, setMenuStatus] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const monthOfYear = monthsOfYear[today.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthOfYear}`;

    const [viewItem, setViewItem] = useState({
        itemImageUrl: "",
        itemName: "",
        itemSub: "",
        numOfItems: "",
        itemPrice: "",
        date: ""
    });

    useEffect(() => {
        (async () => {
            setloadingStatusStatus(true);
            await getUser().then(async (user) => {

                // console.log(res);
                if (user === null) {
                    navigation.navigate("Cart")
                } else {
                    await getWishItems();
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
        // console.log("signed in user", user[0].cardDetails.mapValue.fields.cardDate.stringValue);
        const address = await getAddressonSave();

        setSignedInUser({
            firstname: user[0].firstname.stringValue,
            lastname: user[0].lastname.stringValue,
            imageUrl: user[0].imageUrl.stringValue,
            emailAddress: res.email,
            userID: res.localId,
        });

        return res;
    }

    async function getWishItems() {
        // const jsonValue = await AsyncStorage.getItem('checkout');
        // const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("Ress", res.items);
        const res = await getItems();
        //Get USer
        const jsonValue = await AsyncStorage.getItem('user');
        const resUser = jsonValue != null ? JSON.parse(jsonValue) : null;
        const jsonItemsValue = await AsyncStorage.getItem('wishItems');
        const itemsId = jsonItemsValue != null ? JSON.parse(jsonItemsValue) : null;
        // console.log("itemsId", itemsId);
        var myItems = [];
        var totalIPrice = 0;
        var totalISubPrice = 0;


        itemsId.forEach(id => {
            res.forEach(r => {
                if (id.id === r.id && resUser.localId === id.userID) {
                    // console.log("Item found");
                    const foundItem = {
                        id: r.id,
                        itemImageUrl: r.itemImageUrl.stringValue,
                        itemName: r.itemName.stringValue,
                        itemSub: r.itemSub.stringValue,
                        itemPrepTime: r.itemPrepTime.stringValue,
                        itemPrice: r.itemPrice.stringValue,
                        itemDescription: r.itemDescription.stringValue,
                    }
                    myItems.push(foundItem);
                    totalISubPrice += parseInt(r.itemPrice.stringValue);
                }
            });
        });

        setItems(myItems);

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

    function toCheckout() {
        // console.log("ch");
        navigation.navigate("Checkout")
    }
    function openMenu() {
        setMenuStatus(true);
    }

    function openViewer(item) {
        setViewItem({
            itemImageUrl: item.itemImageUrl,
            itemName: item.itemName,
            itemSub: item.itemSub,
            numOfItems: item.numOfItems,
            itemPrice: item.itemPrice,
            date: item.date
        })
        setorderViewStatus(true);
    }

    function closeViewer() {
        setorderViewStatus(false);
    }

    async function deleteFromList(id) {
        const jsonValue = await AsyncStorage.getItem('wishItems');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("before", res);
       
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
        await AsyncStorage.setItem('wishItems', jsonSetValue).then(async () => {
            console.log("Success");
            setDeleteStatus(true);
            await getWishItems();
        })
    }

    function closeDelete(){
        setDeleteStatus(false)
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
            <View style={styles.header}>
                <View style={styles.menuCont}>
                    <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
                        <Image source={menuIcon} style={styles.menu} />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerTextCont}>
                    <Text style={styles.headerDate}>{formattedDate}</Text>
                    <Text style={styles.headerUser}>Wish List</Text>
                </View>
                <View style={styles.headerImageCont}>
                    <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
                </View>
            </View>

            {orderViewStatus ?
                <View style={{ width: "100%", height: "100%", zIndex: 99, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", top: 0, left: 0, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "90%", height: "70%", backgroundColor: "#FFFEF5", borderRadius: 25 }}>
                        <TouchableOpacity style={{ position: "absolute", right: "5%", top: "3%", width: 40, height: 40, backgroundColor: "#FFFEF5", zIndex: 99, justifyContent: "center", alignItems: "center", borderRadius: 40 }} onPress={closeViewer}>
                            <Image source={closeIcon} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>

                        <Image source={viewItem.itemImageUrl ? { uri: viewItem.itemImageUrl } : subImg} style={{ width: "96%", height: "80%", objectFit: "cover", marginHorizontal: "2%", marginTop: "2%", borderRadius: 20 }} />
                        <View style={[styles.cardDetailsCont, { marginHorizontal: 20 }]}>
                            <Text style={[styles.cardItemTitle, { fontSize: 20 }]}>{viewItem.itemName ? `${viewItem.itemName}` : "Name"}</Text>
                            <Text style={[styles.cardItemSubTitle, { fontSize: 15 }]}>{viewItem.date ? `${viewItem.date}` : "Date"}</Text> 
                            <View style={[styles.priceCont, { position: "absolute", top: 0, right: 0 }]}>
                                <Image source={priceIcon} style={styles.prepTimeIc} />
                                <Text style={styles.prepTimeText}>{viewItem.itemPrice ? `R${viewItem.itemPrice}.00` : "R00.00"}</Text>
                            </View>
                            {/* <Text style={[styles.prepTimeText, { position: "absolute", right: 0, bottom: -40 }]}>Quantity: {viewItem.numOfItems ? `${viewItem.numOfItems}` : "1"}</Text> */}

                        </View>
                    </View>
                </View>
                : null}
            <ScrollView scrollEnabled={true} >
                <>
                    <View >


                        <View style={{ marginTop: 30 }}>
                            <Text style={[styles.paymentTitle, { marginTop: 0 }]}>Wish Items:</Text>

                            <View style={styles.cartCont}>
                                {items.map((item, index) => (
                                    <View style={styles.cartCard} key={index}>
                                        <TouchableOpacity style={styles.itemImgCont} onPress={()=>openViewer(item)}>
                                            <Image source={item.itemImageUrl ? { uri: item.itemImageUrl } : subImg} style={styles.itemImg} />
                                        </TouchableOpacity>
                                        <View style={styles.cardDetailsCont}>
                                            <Text style={styles.cardItemTitle}>{item.itemName ? `${item.itemName}` : "Title"}</Text>
                                            <Text style={styles.cardItemSubTitle}>{item.itemSub ? `${item.itemSub}` : "Sub Title"}</Text>
                                            <View style={styles.priceCont}>
                                                <Image source={prepTimeIcon} style={styles.prepTimeIc} />
                                                <Text style={styles.prepTimeText}>{item.itemPrepTime ? `${item.itemPrepTime}` : "10 - 20 min"}</Text>
                                            </View>

                                        </View>
                                        <View style={[styles.countBtnCont, { position: "absolute", top: 15, right: 10 }]}>
                                            <Image source={wishIcon} style={{width:20,height:20}}/>
                                        </View>
                                        <TouchableOpacity style={styles.deleteButnCont} onPress={() => deleteFromList(item.id, item.totalPrice)}>
                                                <Image source={deleteIcon} style={styles.deleteButn} />
                                            </TouchableOpacity>
                                    </View>
                                ))}


                            </View>


                        </View>

                        
                    </View>
                </>
            </ScrollView>

            {deleteStatus ?
                <View style={{ width: "100%", height: "100%", zIndex: 99, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", top: 0, left: 0, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "90%", height: "35%", backgroundColor: "#FFFEF5", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                        <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <Text style={[styles.modalTitle, { margin: 0 }]}>Successfully deleted.</Text>

                            <TouchableOpacity style={{ height: 50, backgroundColor: "#7C9070", marginTop: 10, width: "70%", borderRadius: 50 }} onPress={closeDelete}>
                                <Text style={styles.siBtnTxt}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                : null}
            {menuStatus ?
        <SideNavComp setMenuStatus={setMenuStatus} />
        : null}
        </View>
    )
}

export default WishScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: '#FFFEF5',
        width: "100%",
    },
    header: {
        position: "relative",
        width: "100%",
        paddingTop: 50,
        height: 200,
        backgroundColor: "#7C9070",
        // borderBottomLeftRadius: 70,
        // borderBottomRightRadius: 50,
    },
    menuCont: {
        marginHorizontal: 30,
        marginTop: 10
    },
    menuBtn: {},
    menu: {
        width: 25,
        height: 25
    },
    headerTextCont: {
        marginHorizontal: 30,
        marginTop: 20,
    },
    headerDate: {
        color: "#FFFEF5",
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 2
    },
    headerUser: {
        color: "#FFFEF5",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 5
    },
    headerImageCont: {
        position: 'absolute',
        top: 70,
        right: 20,

    },
    headerImage: {

        width: 80,
        height: 80,
        objectFit: "cover",
        borderRadius: 100,
        borderWidth: 3,
        borderColor: "#FFFEF5"
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
        marginLeft: 5,
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
        backgroundColor: "#E8F5E0",
        borderRadius:30
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

    deleteButnCont: {
        position: "absolute",
        bottom: 10,
        right: 10
    },
    deleteButn: {
        height: 30,
        width: 30
    },
    modalTitle: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#7C9070"
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