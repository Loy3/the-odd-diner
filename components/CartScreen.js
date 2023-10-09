import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';

import backBtnIcon from "../assets/Icons/prev.png";
import menuIcon from "../assets/Icons/menu.png";
import userIcon from "../assets/Icons/user2.png";
import priceIcon from "../assets/Icons/money.png";
import deleteIcon from "../assets/Icons/delete.png";
import addIcon from "../assets/Icons/add.png";
import subtIcon from "../assets/Icons/minus.png";
import cartIcon from "../assets/Icons/cart.png";
import reviewIcon from "../assets/Icons/review.png";
import checkoutIcon from "../assets/Icons/checkout.png";
import SideNavComp from './SideNavComp';


const CartScreen = ({ navigation }) => {
    const [menuStatus, setMenuStatus] = useState(false);
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
    const [itemsTotalPrice, setItemsTotalPrice] = useState(0);
    const [itemsSubTotalPrice, setItemsSubTotalPrice] = useState(0);
    const [storeItems, setStoreItems] = useState([]);
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [itemsStatus, setitemsStatus] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const monthOfYear = monthsOfYear[today.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthOfYear}`;

    useEffect(() => {
        (async () => {
            setloadingStatusStatus(true);
            await getUser().then(async () => {
                const jsonValue = await AsyncStorage.getItem('cartItems');
                const res = jsonValue != null ? JSON.parse(jsonValue) : null;
                // console.log(res);
                if (res === null) {
                    // navigation.navigate("Home")
                    setitemsStatus(true);
                } else {
                    setitemsStatus(false);
                    await getCartItems(res);
                }
                setloadingStatusStatus(false)
            })
        })();

    }, [])

    const [btnStatus, setBtnStatus] = useState(true);
    useEffect(() => {
        // console.log("line 54",storeItems);
    }, [items])


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
                        numOfItems: 1,
                        totalPrice: r.itemPrice.stringValue
                    }
                    myItems.push(foundItem);
                    totalISubPrice += parseInt(r.itemPrice.stringValue);
                }
            });
        });
        // console.log("myItems",myItems);
        totalIPrice = totalISubPrice + 60;
        setItemsSubTotalPrice(totalISubPrice);
        setItemsTotalPrice(totalIPrice)
        setItems(myItems);
        setStoreItems(myItems);
        // setItems(res);

    }

    async function deleteFromCart(id, iPrice) {
        // await AsyncStorage.removeItem('checkout')
        const jsonValue = await AsyncStorage.getItem('cartItems');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        console.log("before", res);
        var price = iPrice;
        var suTotal = itemsSubTotalPrice;
        var totalIPrice = itemsTotalPrice;
        var remainingItems = [];
        res.forEach(r => {
            if (r.id === id && signedInUser.userID === r.userID) {
                console.log("Found the item");
            } else {
                remainingItems.push(r);
            }
        });

        suTotal = suTotal - parseInt(price);
        totalIPrice = suTotal + 60;
        setItemsSubTotalPrice(suTotal);
        setItemsTotalPrice(totalIPrice);
        console.log("Remaining items", remainingItems);

        const jsonSetValue = JSON.stringify(remainingItems);
        await AsyncStorage.setItem('cartItems', jsonSetValue).then(async () => {
            console.log("Success");
            setDeleteStatus(true)
            await getCartItems(remainingItems);
        })

    }


    function addCount(itemId) {
        setloadingStatusStatus(true);
        var myItems = [...items];
        // console.log(itemId);
        // console.log(myItems);
        var totalIPrice = 0;
        var totalISubPrice = itemsSubTotalPrice;
        var itemIndex = 0;

        for (let i = 0; i < myItems.length; i++) {
            if (myItems[i].id === itemId) {
                // console.log("Item Found");
                itemIndex = i;
            }
        }

        myItems[itemIndex].numOfItems++;
        var totalPrice = parseInt(myItems[itemIndex].itemPrice) * myItems[itemIndex].numOfItems;

        myItems[itemIndex].totalPrice = totalPrice;
        // console.log(totalISubPrice);
        totalISubPrice += parseInt(myItems[itemIndex].itemPrice);
        totalIPrice = totalISubPrice + 60
        setItemsTotalPrice(totalIPrice);
        setItemsSubTotalPrice(totalISubPrice)
        // console.log("line 166",myItems);

        setItems(myItems);
        setloadingStatusStatus(false);
    }

    function subtCount(itemId) {
        setloadingStatusStatus(true);
        var myItems = [...items];
        // console.log(itemId);
        // console.log(myItems);

        var itemIndex = 0;
        var totalIPrice = 0;
        var totalISubPrice = itemsSubTotalPrice;

        for (let i = 0; i < myItems.length; i++) {
            if (myItems[i].id === itemId) {
                // console.log("Item Found");
                itemIndex = i;
            }
        }
        // var currentNum = 
        myItems[itemIndex].numOfItems--;
        totalISubPrice -= parseInt(myItems[itemIndex].itemPrice);

        console.log(myItems[itemIndex].numOfItems);
        if (myItems[itemIndex].numOfItems < 1) {
            myItems[itemIndex].numOfItems = 1;
            totalISubPrice += parseInt(myItems[itemIndex].itemPrice);
            console.log("Current num");
        }

        var totalPrice = parseInt(myItems[itemIndex].totalPrice) - parseInt(myItems[itemIndex].itemPrice);

        if (totalPrice < parseInt(myItems[itemIndex].itemPrice)) {
            totalPrice = parseInt(myItems[itemIndex].itemPrice);

            console.log("Current tp");
        }

        myItems[itemIndex].totalPrice = totalPrice;


        totalIPrice = totalISubPrice + 60
        setItemsTotalPrice(totalIPrice);
        setItemsSubTotalPrice(totalISubPrice)
        // console.log(myItems[itemIndex]);
        setItems(myItems)
        setloadingStatusStatus(false);
    }

    // function getItemQuant(id) {
    //     var getCurrentQuant = 0;
    //     items.forEach(i => {
    //         if (i.id === id) {
    //             getCurrentQuant = i.numOfItems;
    //         }
    //     });
    //     console.log("gg", getCurrentQuant);

    //     return getCurrentQuant;

    // }


    function backToHome() {
        navigation.navigate("Home");
    }

    async function checkout() {
        // await AsyncStorage.removeItem('checkout')
        const checkoutItems = {
            itemsSubTotalPrice: itemsSubTotalPrice,
            itemsTotalPrice: itemsTotalPrice,
            items: items,
            userID: signedInUser.userID
        }
        const jsonValue = JSON.stringify(checkoutItems);
        await AsyncStorage.setItem('checkout', jsonValue).then(() => {
            console.log("Success");
            navigation.navigate("Review")
        })
        // console.log(checkoutItems);
    }
    function openMenu() {
        setMenuStatus(true);
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
                    <Text style={styles.headerUser}>Cart</Text>
                </View>
                <View style={styles.headerImageCont}>
                    <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
                </View>
            </View>
            {/* <View style={{
                height: 130,
                width: "100%",
                backgroundColor: "#7C9070"
            }}>
                <TouchableOpacity style={styles.backBtnCont} onPress={backToHome}>
                    <Image source={backBtnIcon} style={styles.backBtn} />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Cart</Text> */}

            {/* <View style={{ marginTop: 60 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ borderColor: "#A8C099", backgroundColor: "#A8C099", borderWidth: 2, width: "30%" }} />
                                    <View style={{ borderColor: "#FFFEF5", backgroundColor: "#FFFEF5", borderWidth: 2, width: "40%" }} />
                                    <View style={{ borderColor: "#FFFEF5", backgroundColor: "#FFFEF5", borderWidth: 2, width: "30%" }} />
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: "30%", alignItems: "center", justifyContent: "center" }}>
                                        <View style={{ marginTop: -30, alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ backgroundColor: "#A8C099", width: 50, height: 50, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                                {/* <Image source={cartIcon} style={{width: 25, height:25}}/> /}
                                                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#7C9070" }}>1</Text>
                                            </View>
                                            <Text style={{ color: "#FFFEF5", marginTop: 10, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>Cart</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "40%", alignItems: "center", justifyContent: "center" }}>
                                        <View style={{ marginTop: -30, alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ backgroundColor: "#FFFEF5", width: 50, height: 50, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                                {/* <Image source={reviewIcon} style={{width: 30, height:30}}/> /}
                                                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#7C9070" }}>2</Text>
                                            </View>
                                            <Text style={{ color: "#FFFEF5", marginTop: 10, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>Review</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "30%", alignItems: "center", justifyContent: "center" }}>
                                        <View style={{ marginTop: -30, alignItems: "center", justifyContent: "center" }} >
                                            <View style={{ backgroundColor: "#FFFEF5", width: 50, height: 50, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                                {/* <Image source={checkoutIcon} style={{width: 25, height:25}}/> /}
                                                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#7C9070" }}>3</Text>
                                            </View>
                                            <Text style={{ color: "#FFFEF5", marginTop: 10, textAlign: "center", fontSize: 14, fontWeight: "bold", width: "100%" }}>Checkout</Text>
                                        </View>
                                    </View>
                                </View>
                            </View> */}
            {/* </View> */}
            <ScrollView scrollEnabled={true} >
                <>
                    {/* {console.log(items)} */}
                    <View>







                        {itemsStatus ?
                            <View style={{ height: 400, width: "100%", alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 18, color: "#7C9070", fontWeight: "bold" }}>No items...</Text>
                            </View>
                            :
                            <>
                                <Text style={[styles.paymentTitle, { marginTop: 30 }]}>Cart Items:</Text>
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
                                            <View style={styles.numOfItemsCont}>
                                                <TouchableOpacity style={styles.countBtnCont} onPress={() => addCount(item.id)}>
                                                    <Image source={addIcon} style={styles.countBtn} />
                                                </TouchableOpacity>
                                                <View style={styles.counterCont}>
                                                    <Text style={styles.counter}>{item.numOfItems ? `${item.numOfItems}` : "1"}</Text>
                                                </View>
                                                <TouchableOpacity style={styles.countBtnCont} onPress={() => subtCount(item.id)}>
                                                    <Image source={subtIcon} style={styles.countBtn} />
                                                </TouchableOpacity>
                                            </View>


                                            <TouchableOpacity style={styles.deleteButnCont} onPress={() => deleteFromCart(item.id, item.totalPrice)}>
                                                <Image source={deleteIcon} style={styles.deleteButn} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}


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
                                    <View style={styles.pLine} />
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={styles.totalLeft}>Total</Text>
                                        <Text style={styles.totalRight}>R{itemsTotalPrice}.00</Text>
                                    </View>



                                </View>
                            </>
                        }
                    </View>
                    {/* {console.log(items)} */}

                </>
            </ScrollView>
            {itemsStatus ?
                null :
                <View style={styles.siBtnCont}>
                    {/* <View style={styles.pricingCont}>
                                    <Text style={styles.pricingTitle}>Pricing</Text>
                                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                                        <Text style={styles.subTotalLeft}>Sub Total</Text>
                                        <Text style={styles.subTotalRight}>R{itemsSubTotalPrice}.00</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                                        <Text style={styles.subTotalLeft}>Delivery Fee:</Text>
                                        <Text style={styles.subTotalRight}>R60.00</Text>
                                    </View>
                                    <View style={styles.pLine} />
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={styles.totalLeft}>Total</Text>
                                        <Text style={styles.totalRight}>R{itemsTotalPrice}.00</Text>
                                    </View>

                                  

                                </View> */}
                    <TouchableOpacity style={styles.siBtn} onPress={checkout}>
                        {/* <TouchableOpacity style={styles.siBtn}  onPress={() => navigation.navigate("Journals")}> */}
                        <Text style={styles.siBtnTxt}>Review</Text>
                    </TouchableOpacity>
                </View>
            }

            {menuStatus ?
                <SideNavComp setMenuStatus={setMenuStatus} />
                : null}
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
    modalTitle: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#7C9070"
    },
    cartCont: {
        width: "92%",
        height: "auto",
        // backgroundColor: "yellow",
        marginHorizontal: "4%",
        marginTop: 20,
        marginBottom: 100
    },
    cartCard: {
        height: 105,
        width: "100%",
        // backgroundColor: "#E8F5E0",
        marginBottom: 20,
        // borderColor: "#7C9070",
        // borderWidth: 3,
        flexDirection: "row"
    },
    itemImgCont: {
        width: "25%",
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
        height: 35,
        width: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#7C9070"
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#7C9070"
    },
    // pricingCont: {
    //     pricingCont: {
    //     width: "90%",
    //     height: 200,
    //     marginHorizontal: "5%",
    //     // backgroundColor: "yellow",
    //     marginTop: 100,
    //     marginBottom: 20,
    //     position: "fixed",
    //     zIndex: 99,
    //     bottom: 0
    // },
    pricingCont: {
        width: "90%",
        height: 200,
        marginHorizontal: "5%",
        // backgroundColor: "yellow",
        // marginTop: 100,
        marginBottom: 0,
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
    pLine: {
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
    siBtnCont: {
        width: "90%",
        // height: 300,
        marginHorizontal: "5%",
        // backgroundColor: "yellow",
        // marginTop: 100,
        // marginBottom: 20,
        position: "fixed",
        zIndex: 99,
        bottom: 0
    },
    siBtn: {
        width: "100%",
        // marginHorizontal: "8%",
        marginBottom: 30,
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