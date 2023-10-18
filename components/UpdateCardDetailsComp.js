import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';
import { updateUserCardDetails, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import userIcon from "../assets/Icons/id2.png";
import closeBtnIcon from "../assets/Icons/close.png";

import { useNavigation } from '@react-navigation/native';

const UpdateCardDetailsComp = ({ setpopUpCardStatus }) => {
    const navigation = useNavigation();

    const [cardName, setcardName] = useState("");
    const [cardNum, setcardNum] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [cardDate, setcardDate] = useState("");
    const [warningMsg, setWarningMsg] = useState("")
    const [warningStatus, setWarningStatus] = useState(false);

    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null,
        cardName: null,
        cardNum: null,
        zipCode: null,
        cardDate: null,
        docID: null

    });
    useEffect(() => {
        (async () => {
            await getUser().then(async (user) => {

                // console.log(res);
                if (user === null) {
                    navigation.navigate("Home")
                }
            })
        })();

    }, [])

    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        // console.log("Ress", user[0]);
        const user = await getUsers(res.localId)
        // console.log("signed in user", user[0].cardDetails.mapValue.fields);
        setSignedInUser({
            firstname: user[0].firstname.stringValue,
            lastname: user[0].lastname.stringValue,
            imageUrl: user[0].imageUrl.stringValue,
            emailAddress: res.email,
            userID: res.localId,
            cardName: `${user[0].cardDetails.mapValue.fields.cardName.stringValue} `,
            cardNum: `${user[0].cardDetails.mapValue.fields.cardNum.stringValue}`,
            zipCode: `${user[0].cardDetails.mapValue.fields.zipCode.stringValue}`,
            cardDate: `${user[0].cardDetails.mapValue.fields.cardDate.stringValue}`,
            docID: user[0].id
        });
        return res;
    }

    async function onSave() {
        // const locate = await checkLocation();
        // console.log(locate);
        if (cardName === "" || cardNum === "" || zipCode === "" || cardDate === "") {
            setWarningMsg("Fields shouldn't be left empty");
            setWarningStatus(true)
        } else {
            setWarningMsg("");
            setWarningStatus(false)
            // console.log(cardName);
            const res = {
                cardName: cardName,
                cardNum: cardNum,
                zipCode: zipCode,
                cardDate: cardDate,
                id:signedInUser.docID
            }
            await updateUserCardDetails(res).then(async()=>{
                console.log("Success");

                const jsonValue = JSON.stringify(res);
                await AsyncStorage.setItem('cardDetails', jsonValue).then(() => {
                  console.log("Success");
                  
                  navigation.navigate(`StopBy`);
                  setpopUpCardStatus(false);
                })

        }).catch((error)=>{
            console.log("Error: ",error);
        })




        }
    }

    // async function checkLocation() {
    //     const jsonValue = await AsyncStorage.getItem('location');
    //     const location = jsonValue != null ? JSON.parse(jsonValue) : null;
    //     var locate = "";

    //     if (location !== null) {
    //         // console.log(location);
    //         if (location.locate === "checkout") {
    //             locate = "Checkout";
    //         } else if (location.locate === "profile") {
    //             locate = "ViewProfile";
    //         }
    //     }


    //     return locate;
    // }



    function onClose() {
        setpopUpCardStatus(false);
    }

    return (
        <View style={styles.container}>
            <View >
                <TouchableOpacity style={styles.closeBtnCont} onPress={onClose}>
                    <Image source={closeBtnIcon} style={styles.closeBtn} />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Card Details:</Text>

            {warningStatus ?
                <Text style={{
                    color: "red", marginBottom: 10,
                    marginTop: -10, marginLeft: 10, marginLeft: "8%"
                }}>{warningMsg}</Text>
                : null}

            <View style={styles.textInputCont}>
                <View style={styles.iconCont}>
                    <Image source={userIcon} style={styles.icon} />
                </View>

                <View>
                    <TextInput style={styles.formInput}
                        autoComplete="off"
                        keyboardType="visible-password"
                        autoCapitalize="none"
                        onChangeText={text => setcardName(text)}
                        value={cardName} placeholder={"Enter card name:"} />
                </View>

            </View>

            <View style={styles.textInputCont}>
                <View style={styles.iconCont}>
                    <Image source={userIcon} style={styles.icon} />
                </View>

                <View>
                    <TextInput style={styles.formInput}
                        autoComplete="off"
                        keyboardType="visible-password"
                        autoCapitalize="none"
                        onChangeText={text => setcardNum(text)}
                        value={cardNum} placeholder={"Enter card number:"} />
                </View>

            </View>

            <View style={styles.textInputCont}>
                <View style={styles.iconCont}>
                    <Image source={userIcon} style={styles.icon} />
                </View>

                <View>
                    <TextInput style={styles.formInput}
                        autoComplete="off"
                        keyboardType="visible-password"
                        autoCapitalize="none"
                        onChangeText={text => setZipCode(text)}
                        value={zipCode} placeholder={"cvv"} />
                </View>

            </View>

            <View style={styles.textInputCont}>
                <View style={styles.iconCont}>
                    <Image source={userIcon} style={styles.icon} />
                </View>

                <View>
                    <TextInput style={styles.formInput}
                        autoComplete="off"
                        keyboardType="visible-password"
                        autoCapitalize="none"
                        onChangeText={text => setcardDate(text)}
                        value={cardDate} placeholder={"mm/yy"} />
                </View>

            </View>

            <View style={styles.btnCon}>
                <TouchableOpacity style={styles.siBtn} onPress={onSave}>
                    {/* <TouchableOpacity style={styles.siBtn}  onPress={() => navigation.navigate("Journals")}> */}
                    <Text style={styles.siBtnTxt}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default UpdateCardDetailsComp


const styles = StyleSheet.create({
    container: {
        width: "90%",
        marginHorizontal: "5%",
        // height:"84%",
        marginVertical: "8%"

    },
    closeBtnCont: {
        position: "absolute",
        top: -20,
        right: -10,
        backgroundColor: "#FFFEF5",
        borderWidth: 2,
        borderColor: "#7C9070",
        borderRadius: 60,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",

    },
    closeBtn: {
        width: 20,
        height: 20
    },
    title: {
        color: "#7C9070",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        marginLeft: 10
    },
    subTitle: {
        fontSize: 16
    },
    userImg: {
        width: 100,
        height: 100,
        position: "absolute",
        top: 200,
        right: 30,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#7C9070"
    },

    textInputCont: {
        width: "100%",
        height: 57,
        backgroundColor: "#FFFEF5",
        borderColor: "#7C9070",
        borderRadius: 50,
        borderWidth: 2,
        // alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    iconCont: {
        position: "absolute",
        left: -2,
        top: -2,
        width: 70,
        height: 57,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        backgroundColor: "#7C9070",
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        width: 30,
        height: 30
    },

    formInput: {
        width: "80%",
        marginLeft: 75,
        height: "100%"
    },
    siBtn: {
        width: "100%",
        height: 60,
        borderRadius: 50,
        marginTop: 20,
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
})