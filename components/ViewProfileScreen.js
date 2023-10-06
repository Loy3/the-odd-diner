import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideNavComp from './SideNavComp';
import cover from "../assets/Images/cover.jpg";
import menuIcon from "../assets/Icons/menu.png";
import userIcon from "../assets/Icons/user2.png";
import updateIcon from "../assets/Icons/edit.png";
import dropdowmIcon from "../assets/Icons/prev.png";
import cardIcon from "../assets/Icons/id.png";
import UpdateAddressComp from './UpdateAddressComp';

const ViewProfileScreen = () => {
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
    });

    const [menuStatus, setMenuStatus] = useState(false);
    const [popUpStatus, setpopUpStatus] = useState(false);
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
            await getUser()
        })();

    }, [])

    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;

        const user = await getUsers(res.localId)
        // console.log("Ress", res);
        // console.log("signed in user", user[0].lastname.stringValue);
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
        // return null;
    }

    function openMenu() {
        setMenuStatus(true);
    }
    function editAddress() {
        setpopUpStatus(true)
    }


    return (
        <View style={styles.container}>

            <ScrollView scrollEnabled={true} >
                <>
                    <View>
                        <View style={styles.topImg} >
                            <Image source={signedInUser.imageUrl ? { uri: `${signedInUser.imageUrl}` } : cover} style={styles.landingImg} />
                        </View>
                        <View style={styles.topBg} />

                        <View style={styles.header}>
                            <View style={styles.menuCont}>
                                <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
                                    <Image source={menuIcon} style={styles.menu} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.headerTextCont}>
                                <Text style={styles.headerDate}>{formattedDate}</Text>
                                <Text style={styles.headerUser}>Profile</Text>
                            </View>

                        </View>
                        <View style={styles.headerImageCont}>
                            <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
                            <View style={{ width: 300, height: 320, borderRadius: 320, backgroundColor: "#7C9070", opacity: 0.35, marginTop: -320 }} />
                        </View>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Text style={{ marginTop: 20, fontSize: 30, fontWeight: "700", color: "#7C9070", marginLeft:-7 }}>{signedInUser.firstname ? `${signedInUser.firstname} ${signedInUser.lastname}` : "User"}</Text>
                            <Text style={{ marginTop: 5, fontSize: 18, fontWeight: "400", color: "#7C9070", marginLeft:-10 }}>{signedInUser.address ? `${signedInUser.address} ${signedInUser.city}, ${signedInUser.addressZip}` : "User"}</Text>

                            <TouchableOpacity style={{ position: "absolute", right: 20, top: 68 }} onPress={editAddress}>
                                <Image source={updateIcon} style={styles.menu} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 50 }}>
                            <View style={styles.detailsCont}>
                                <View style={styles.personalCont}>
                                    <Image source={userIcon} style={styles.detailsImg} />
                                    <Text style={styles.detailsTxt}>Personal Details</Text>

                                    <View style={{position:"absolute", right: 15}}>
                                        <Image source={dropdowmIcon} style={styles.menu}/>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.detailsCont}>
                                <View style={styles.personalCont}>
                                    <Image source={cardIcon} style={[styles.detailsImg, {marginTop:-3}]} />
                                    <Text style={styles.detailsTxt}>Card Details</Text>

                                    <View style={{position:"absolute", right: 15}}>
                                        <Image source={dropdowmIcon} style={styles.menu}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            </ScrollView>

            {menuStatus ?
                <SideNavComp setMenuStatus={setMenuStatus} />
                : null}


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

export default ViewProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF5',
        flex: 1,
        //     backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    topImg: {
        width: "100%",
        height: "auto",
        marginTop: 30,
        // alignItems: "center",
        // position: "absolute",
        // top: 30
    },
    landingImg: {
        width: "100%",
        height: 200,
        objectFit: "cover",
        // marginTop: -20
    },
    topBg: {
        position: "absolute",
        top: 30,
        backgroundColor: "#7C9070",
        zIndex: 10,
        height: 200,
        width: "100%",
        opacity: 0.8
    },
    header: {
        position: "absolute",
        width: "100%",
        paddingTop: 50,
        height: 200,
        top: 0,
        zIndex: 20
        // backgroundColor: "#7C9070",
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
        // position: 'absolute',
        // top: 60,
        // right: 0,
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
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -80,
        zIndex: 30
        // position: 'absolute',
        // top: 100,
        // left: 20,

    },
    headerImage: {
        width: 320,
        height: 320,
        objectFit: "cover",
        borderRadius: 300,
        borderWidth: 3,
        borderColor: "#7C9070"
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
    detailsCont: {
        width: "90%",
        marginHorizontal: "5%",
        height: 70,
        borderWidth: 3,
        borderColor: "#7C9070",
        borderRadius: 35,
        marginBottom:10
    },
    personalCont: {
        flexDirection: "row",
        height: "100%",
        width: "100%",
        alignItems: "center"
    },
    detailsImg: {
        width: 30,
        height: 30,
        marginLeft: 15
    },
    detailsTxt: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "#7C9070"
    },

})