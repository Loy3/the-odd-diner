import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers, getOrders } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';

import closeIcon from "../assets/Icons/close.png";
import subImg from "../assets/Images/1.jpg";
import menuIcon from "../assets/Icons/menu.png";
import userIcon from "../assets/Icons/user2.png";
import priceIcon from "../assets/Icons/money.png";
import SideNavComp from './SideNavComp';

const OrdersScreen = ({ navigation }) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const monthOfYear = monthsOfYear[today.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthOfYear}`;
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [menuStatus, setMenuStatus] = useState(false);
    const [orderViewStatus, setorderViewStatus] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsTotalPrice, setItemsTotalPrice] = useState(0);
    const [itemsSubTotalPrice, setItemsSubTotalPrice] = useState(0);
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
    });
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
            await getUser().then(async (id) => {
                // const res = await getUserOrders();

                await getUserOrders(id).then(async (list) => {
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
        // console.log("signed in user", user[0].lastname.stringValue);
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
        // console.log(orders);
        orders.forEach(ord => {

            const myItemsArr = ord.items.arrayValue.values;
            // console.log("Orders", ord);

            myItemsArr.forEach(item => {
                // console.log(`Orders${cont++}`, date:ord.date);
                listOfItems.push({ date: ord.date, ...item.mapValue.fields });
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

        // console.log("itemsId", list);
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
                        orderStatus: l.orderStatus.stringValue,
                        date: l.date.stringValue
                    }
                    myItems.push(foundItem);
                    totalISubPrice += parseInt(r.itemPrice.stringValue);
                }
            });
        });
        // console.log(myItems);
        let sortedItems = [];
        sortedItems = myItems.reduce((acc, obj) => {
            const date = obj.date;
            // const idNum = obj.item;
            if (!acc[date]) {
                acc[date] = [obj];
            } else {
                acc[date].push(obj);
            }
            return acc;
        }, {});

        const arr = Object.entries(sortedItems).map(([date, value]) => ({ date, value }));
        // console.log("arr[0].value",arr[0].value);
        setItems(arr);
        // setViewItem({
        //     itemImageUrl: myItems[0].itemImageUrl,
        //     itemName: myItems[0].itemName,
        //     itemSub: myItems[0].itemSub,
        //     numOfItems: myItems[0].numOfItems,
        //     itemPrice: myItems[0].itemPrice,
        //     date: myItems[0].date,
        // })
        // console.log("myItems",myItems[0]);
        // totalIPrice = totalISubPrice + 60;
        // setItemsSubTotalPrice(totalISubPrice);
        // setItemsTotalPrice(totalIPrice)
        // setItems(myItems);
        setloadingStatusStatus(false)

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

    function navigateToProfile() {
        navigation.navigate("ViewProfile");
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
                <TouchableOpacity style={styles.headerImageCont} onPress={navigateToProfile}>
                    <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
                </TouchableOpacity>
            </View>

            {orderViewStatus ?
                <View style={{ width: "100%", height: "100%", zIndex: 99, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", top: 0, left: 0, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "90%", height: "70%", backgroundColor: "#FFFEF5", borderRadius: 40 }}>
                        <TouchableOpacity style={{ position: "absolute", right: "7%", top: "5%", width: 40, height: 40, backgroundColor: "#FFFEF5", zIndex: 99, justifyContent: "center", alignItems: "center", borderRadius: 40 }} onPress={closeViewer}>
                            <Image source={closeIcon} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>

                        <Image source={viewItem.itemImageUrl ? { uri: viewItem.itemImageUrl } : subImg} style={{ width: "94%", height: "76%", objectFit: "cover", marginHorizontal: "3%", marginTop: "3%", borderRadius: 30 }} />
                        <View style={[styles.cardDetailsCont, { marginHorizontal: 20 }]}>
                            <Text style={[styles.cardItemTitle, { fontSize: 20 }]}>{viewItem.itemName ? `${viewItem.itemName}` : "Name"}</Text>
                            <Text style={[styles.cardItemSubTitle, { fontSize: 15 }]}>{viewItem.date ? `${viewItem.date}` : "Date"}</Text>
                            <View style={[styles.priceCont, { position: "absolute", top: 0, right: 0 }]}>
                                <Image source={priceIcon} style={styles.prepTimeIc} />
                                <Text style={styles.prepTimeText}>{viewItem.itemPrice ? `R${viewItem.itemPrice}.00` : "R00.00"}</Text>
                            </View>
                            <Text style={[styles.prepTimeText, { position: "absolute", right: 0, bottom: -40 }]}>Quantity: {viewItem.numOfItems ? `${viewItem.numOfItems}` : "1"}</Text>

                        </View>
                    </View>
                </View>
                : null}

            <ScrollView scrollEnabled={true} >
                <>
                    <View>

                        <View>
                            <View style={{ marginTop: 0, marginBottom: 30 }}>
                                <Text style={[styles.paymentTitle, { marginTop: 30, marginLeft: "3%" }]}>Orders:</Text>

                                <View style={styles.cartCont}>
                                    {items.map((item, index) => (
                                        <View key={index}>
                                            <Text style={[styles.paymentTitle, { marginTop: 20, fontSize: 18, marginLeft: -5 }]}>Order date: {item.date ? item.date : "Friday, 13th October"}</Text>
                                            {item.value.map((itm, index) => (
                                                <View style={styles.cartCard} key={index}>
                                                    <TouchableOpacity style={styles.itemImgCont} onPress={() => openViewer(itm)}>
                                                        <Image source={itm.itemImageUrl ? { uri: itm.itemImageUrl } : subImg} style={styles.itemImg} />
                                                    </TouchableOpacity>
                                                    <View style={styles.cardDetailsCont}>
                                                        <Text style={styles.cardItemTitle}>{itm.itemName ? `${itm.itemName}` : "Title"}</Text>
                                                        <Text style={styles.cardItemSubTitle}>{itm.date ? `${itm.date}` : "Date"}</Text>

                                                        <View style={styles.priceCont}>
                                                            <Image source={priceIcon} style={styles.prepTimeIc} />
                                                            <Text style={styles.prepTimeText}>{itm.totalPrice ? `R${itm.totalPrice}.00` : "R00.00"}</Text>
                                                        </View>


                                                    </View>

                                                    <View style={[styles.countBtnCont, { position: "absolute", top: 15, right: 10 }]}>
                                                        <Text style={styles.counter}>{itm.numOfItems ? `${itm.numOfItems}` : "1"}</Text>
                                                    </View>


                                                </View>
                                            ))}
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
        fontSize: 13,
        // fontWeight:"bold",
        color: "#7C9070",
        marginTop: 3,
        marginLeft: 2
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
        borderRadius: 30
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