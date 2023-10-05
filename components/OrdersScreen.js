import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers, getOrders } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';


import menuIcon from "../assets/Icons/menu.png";
import userIcon from "../assets/Icons/user2.png";
import priceIcon from "../assets/Icons/money.png";
import SideNavComp from './SideNavComp';
const OrdersScreen = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const monthOfYear = monthsOfYear[today.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthOfYear}`;
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [menuStatus, setMenuStatus] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsTotalPrice, setItemsTotalPrice] = useState(0);
    const [itemsSubTotalPrice, setItemsSubTotalPrice] = useState(0);
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
    });

    useEffect(() => {
        (async () => {
            setloadingStatusStatus(true);
            await getUser().then(async (id) => {
                // const res = await getUserOrders();
                
                await getUserOrders(id).then(async(list)=>{
                    await getOrderItems(list);
                })
                               
            })
        })();

    }, [])

    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;

        const user = await getUsers(res.localId)
        // console.log("Ress", res.localId);
        console.log("signed in user", user[0].lastname.stringValue);
        setSignedInUser({
            firstname: user[0].firstname.stringValue,
            lastname: user[0].lastname.stringValue,
            imageUrl: user[0].imageUrl.stringValue,
            emailAddress: res.email,
            userID: res.localId
        });
        return res.localId;
    }

    async function getUserOrders(id) {
        // console.log(id);
        const orders = await getOrders(id);

        var listOfItems = [];
        // var cont = 1;
        orders.forEach(ord => {

            const myItemsArr = ord.items.arrayValue.values;
            console.log("Orders", myItemsArr);


            myItemsArr.forEach(item => {
                // console.log(`Orders${cont++}`, item.mapValue.fields);
                listOfItems.push(item.mapValue.fields);
            });
        });

        // console.log("listOfItems",listOfItems);
        // await getOrderItems(listOfItems);
        return listOfItems;
    }

    async function getOrderItems(list) {
        const res = await getItems();
        //Get USer
        const jsonValue = await AsyncStorage.getItem('user');
        const resUser = jsonValue != null ? JSON.parse(jsonValue) : null;

        // console.log("itemsId", list[0]);
        var myItems = [];
        var totalIPrice = 0;
        var totalISubPrice = 0;

        list.forEach(l => {
            res.forEach(r => {
                if (l.itemID.stringValue === r.id) {
                    // console.log("Item found");
                    const foundItem = {
                        id: r.id,
                        itemImageUrl: r.itemImageUrl.stringValue,
                        itemName: r.itemName.stringValue,
                        itemSub: r.itemSub.stringValue,
                        itemPrepTime: r.itemPrepTime.stringValue,
                        itemPrice: r.itemPrice.stringValue,
                        itemDescription: r.itemDescription.stringValue,
                        numOfItems: l.numOfItems.stringValue,
                        totalPrice: l.totalPrice.stringValue,
                        orderStatus: l.orderStatus.stringValue
                    }
                    myItems.push(foundItem);
                    totalISubPrice += parseInt(r.itemPrice.stringValue);
                }
            });
        });

        // console.log("myItems",myItems[0]);
        // totalIPrice = totalISubPrice + 60;
        // setItemsSubTotalPrice(totalISubPrice);
        // setItemsTotalPrice(totalIPrice)
        setItems(myItems);
        setloadingStatusStatus(false)

    }

    function openMenu() {
        setMenuStatus(true);
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
                    <Text style={styles.headerUser}>Orders</Text>
                </View>
                <View style={styles.headerImageCont}>
                    <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
                </View>
            </View>
            {/* {console.log("itemssss",items)} */}
            <ScrollView scrollEnabled={true} >
                <>
                    <View>


                        <View>
                            <View style={{ marginTop: 0, marginBottom: 30 }}>
                                <Text style={[styles.paymentTitle, { marginTop: 30 }]}>Order Items:</Text>

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
                        </View>

                    </View>

                </>
            </ScrollView>
            {menuStatus ?
                <SideNavComp setMenuStatus={setMenuStatus} />
                : null}
        </View>
    )
}

export default OrdersScreen

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
        height: 210,
        backgroundColor: "#7C9070",
        // borderBottomLeftRadius: 150,
        // borderBottomRightRadius: 150,
    },
    menuCont: {
        marginHorizontal: 30,
        marginTop: 10
    },
    menuBtn: {},
    menu: {
        width: 30,
        height: 30
    },
    headerTextCont: {
        marginHorizontal: 30,
        marginTop: 30,
    },
    headerDate: {
        color: "#FFFEF5",
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 2
    },
    headerUser: {
        color: "#FFFEF5",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 5
    },
    headerImageCont: {
        position: 'absolute',
        top: 70,
        right: 20,

    },
    headerImage: {

        width: 90,
        height: 90,
        objectFit: "cover",
        borderRadius: 100,
        borderWidth: 3,
        borderColor: "#FFFEF5"
    },
    paymentTitle: {
        marginTop: 50,
        marginLeft: "5%",
        fontSize: 21,
        fontWeight: "bold",
        color: "#7C9070"
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
    countBtnCont: {
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#7C9070",
        // borderRadius:100
    },
    counter: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFEF5"
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