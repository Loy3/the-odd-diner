import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';
import { signIn } from "../services/serviceAuth";

import { storage } from "../config/Firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storeUserDoc } from "../services/serviceStoreDoc";

import cover from "../assets/Images/cover.jpg";
import emailIcon from "../assets/Icons/email.png";
import userIcon from "../assets/Icons/user.png";
import phoneIcon from "../assets/Icons/smartphone.png";
import imgIcon from "../assets/Icons/image.png";
import locationIcon from "../assets/Icons/location.png";

import altImg from "../assets/Icons/user2.png";

import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddressComp from './AddressComp';
import CardDetailsComp from './CardDetailsComp';

const ProfileScreen = ({ setSignIn }) => {
    const navigation = useNavigation();
    const [emailAddress, setEmailAddress] = useState("");
    const [userId, setUserId] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [cardDetails, setCardDetails] = useState("Enter Card Details:");
    const [addressDetails, setAddressDetails] = useState("Enter Physical Address:");

    const [cardDetailsArr, setCardDetailsArr] = useState(null);
    const [addressDetailsArr, setAddressDetailsArr] = useState("");

    const [userImage, setUserImage] = useState(null);


    const [passwordVis, setPasswordVis] = useState(true);
    const [warningMsg, setWarningMsg] = useState("")
    const [warningStatus, setWarningStatus] = useState(false)
    const [errorMSG, seterrorMSG] = useState("");

    const [popUpStatus, setpopUpStatus] = useState(false)
    const [popUpCardStatus, setpopUpCardStatus] = useState(false);

    const [loadingStatus, setloadingStatusStatus] = useState(false);

    const [cardStatus, setCardStatus] = useState(false)
    const [addrStatus, setAddrStatus] = useState(false)

    const [btnDisable, setBtnDisable] = useState(true)


    useEffect(() => {
        (async () => {
            const user = await getUser();
            // console.log("The user", user);?
            if (user !== null) {
                // console.log("user", user.localId)
                setEmailAddress(user.email)
                setUserId(user.localId);
            } else {
                console.log("Not Signed In");
            }

        })();
    }, [getUser]);

    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('myUser');
        // const jsonValue = await AsyncStorage.removeItem('user');

        // const user = JSON.parse(jsonValue);
        // console.log("RTN User", JSON.parse(jsonValue));

        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }

    useEffect(() => {
        (async () => {
            const address = await getAddress();
            if (address !== null) {
                setAddrStatus(true);
                const addressDtls = `${address.streetAddr} ${address.city}, ${address.zipCode}`;
                setAddressDetails(addressDtls);
            } else {
                // console.log("No address");
                setAddrStatus(false);
            }

        })();
    }, [getAddress]);

    async function getAddress() {
        const jsonValue = await AsyncStorage.getItem('physicalAddress');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
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
            setWarningStatus(true)
            setWarningMsg("Address missing")
        }

        return myAddress;
    }

    useEffect(() => {
        (async () => {
            const card = await getCardDetails();
            if (card !== null) {
                setCardStatus(true);
                setCardDetails("Card Details Added.");
            } else {
                // console.log("No card details");
                setCardStatus(false);
                setCardDetails("Enter Card Details:");
            }

        })();
    }, [getCardDetails]);

    async function getCardDetails() {
        const jsonValue = await AsyncStorage.getItem('cardDetails');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }

    async function getCardDetailsOnSav() {
        //Get card details
        var myCardDetails = null;
        const card = await getCardDetails();
        if (card !== null) {
            const cardDets = {
                cardName: card.cardName,
                cardNum: card.cardNum,
                zipCode: card.zipCode,
                cardDate: card.cardDate
            }
            myCardDetails = cardDets;
        } else {
            setWarningStatus(true)
            setWarningMsg("Card details missing")
        }

        return myCardDetails;
    }

    // useEffect(() => {
    //     if (cardStatus === true && addressDetails === true) {
    //         setBtnDisable(false);
    //     } else {
    //         setBtnDisable(true);
    //     }
    // }, [])

    async function onSave() {

        if (phoneNum !== "" && lastname !== "" && firstname !== "") {
            console.log("All is well");
            setWarningStatus(false)
            setWarningMsg("")

            //Get address 
            const myAddress = await getAddressonSave();
            // console.log("address", myAddress);

            //Get card details
            const myCardDetails = await getCardDetailsOnSav();
            // console.log("Card", myCardDetails);

            if (myAddress !== null && myCardDetails !== null) {

                setloadingStatusStatus(true);
                //Store
                // console.log(userImage);

                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        try {
                            resolve(xhr.response);
                        } catch (error) {
                            console.log("Error:", error);
                        }
                    };
                    xhr.onerror = (e) => {
                        console.log(e);
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", userImage, true);
                    xhr.send(null);
                });
                if (blob != null) {
                    const uriParts = userImage.split(".");
                    const fileType = uriParts[uriParts.length - 1];

                    const userImgToStore = `${emailAddress}${new Date().getTime()}.${fileType}`;
                    const path = `oddUsers/${userImgToStore}`;

                    const storageRef = ref(storage, path);
                    uploadBytes(storageRef, blob).then(() => {
                        // Get download URL
                        getDownloadURL(storageRef)
                            .then(async (url) => {
                                // Save data to Firestore   
                                const myUserToStore = {
                                    firstname: firstname,
                                    lastname: lastname,
                                    emailAddress: emailAddress,
                                    phoneNum: phoneNum,
                                    imageName: userImgToStore,
                                    imageUrl: url,

                                    streetAddr: myAddress.streetAddr,
                                    city: myAddress.city,
                                    zipCode: myAddress.zipCode,


                                    cardName: myCardDetails.cardName,
                                    cardNum: myCardDetails.cardNum,
                                    zipCode: myCardDetails.zipCode,
                                    cardDate: myCardDetails.cardDate,

                                    userId: userId

                                }

                                // console.log("User detail", myUserToStore);

                                await storeUserDoc(myUserToStore);
                                console.log("saved");
                            })
                            .catch((error) => {
                                console.error(error);
                            }).then(async () => {
                                // setRecordings([]);
                                // setIsLoading(false);
                                // navigation.navigate("Journals")
                                console.log("very saved");
                                setloadingStatusStatus(false);
                                await AsyncStorage.removeItem('physicalAddress').then(async () => {
                                    // console.log("Address removed");
                                    await AsyncStorage.removeItem('cardDetails').then(() => {
                                        // console.log("Card Details removed");

                                    }).then(async () => {
                                        const userRes = JSON.stringify(await getUser());
                                        await AsyncStorage.setItem('user', userRes).then(async () => {
                                            console.log("Success");
                                            await AsyncStorage.removeItem('myUser').then(() => {
                                                // console.log("myUser removed");
                                                // navigation.navigate("Home")
                                                setSignIn(true)
                                            })

                                        })
                                    })
                                }).catch((error) => {
                                    console.log("Error", error);
                                })



                            })
                    });
                } else {
                    console.log("error with blob");
                }
                //End
            } else {
                setWarningStatus(true)
                setWarningMsg("Card details or physical address is missing!")
            }


        } else {
            setWarningStatus(true)
            setWarningMsg("Fields cannot be left empty!")
        }

        // console.log(emailAddress, password);
        // if (password === "" || emailAddress === "") {
        //     setWarningStatus(true)
        //     setWarningMsg("Email or Password required")
        // } else {
        //     const user = await signIn(emailAddress, password);
        //     const res = await user;
        //     // console.log("My User", res);

        //     if (res.error) {
        //         console.log(res.error.message);
        //         setWarningStatus(true)
        //         setWarningMsg("Email or Password is invalid")
        //     } else {
        //         setWarningStatus(true)
        //         setWarningMsg("")
        //         // console.log("all is well");
        //         const jsonValue = JSON.stringify(res);
        //         await AsyncStorage.setItem('user', jsonValue).then(() => {
        //             console.log("Success");
        //             setSignIn(true)
        //         })
        //     }
        // }

    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        // console.log(result);

        if (!result.canceled) {
            setUserImage(result.assets[0].uri);
        }
    };

    function openAddressPopup() {
        setpopUpStatus(true)
    }

    function openCardPopup() {
        setpopUpCardStatus(true)
    }

    return (
        <View style={styles.container}>
            <ScrollView scrollEnabled={true} >

                <View style={styles.topImg} >
                    <Image source={cover} style={styles.landingImg} />
                </View>
                <View style={styles.topBg} />
                {userImage !== null ?
                    <Image source={{ uri: userImage }} style={styles.userImg} />
                    : <Image source={altImg} style={styles.userImg} />
                }
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                    <Text style={styles.subTitle}>Let's set up your profile.</Text>
                </View>

                {warningStatus ?
                    <Text style={{
                        color: "red", marginBottom: 10,
                        marginTop: -30, marginLeft: 10, marginLeft: "8%"
                    }}>{warningMsg}</Text>
                    : null}

                {/* <View style={styles.buttonsCont}>
                    <TouchableOpacity style={styles.buttons} onPress={openAddressPopup}><Text style={styles.buttonsText}>Add Address</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.buttons}><Text style={styles.buttonsText}>BTN 2</Text></TouchableOpacity>
                </View> */}


                <View style={styles.textInputCont}>
                    <View style={styles.iconCont}>
                        <Image source={userIcon} style={styles.icon} />
                    </View>

                    <View>
                        <TextInput style={styles.formInput}
                            autoComplete="off"
                            keyboardType="visible-password"
                            autoCapitalize="none"
                            onChangeText={text => setFirstname(text)}
                            value={firstname} placeholder={"Enter your first name:"} />
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
                            onChangeText={text => setLastname(text)}
                            value={lastname} placeholder={"Enter your last name:"} />
                    </View>
                </View>

                <View style={styles.textInputCont}>
                    <View style={styles.iconCont}>
                        <Image source={emailIcon} style={styles.icon} />
                    </View>

                    <View>
                        <Text style={styles.formInputE}>{`Email: ${emailAddress}`}</Text>
                    </View>
                </View>

                <View style={styles.textInputCont}>
                    <View style={styles.iconCont}>
                        <Image source={phoneIcon} style={styles.icon} />
                    </View>

                    <View>
                        <TextInput style={styles.formInput}
                            autoComplete="off"
                            keyboardType="visible-password"
                            autoCapitalize="none"
                            onChangeText={text => setPhoneNum(text)}
                            value={phoneNum} placeholder={"Enter your phone number:"} />
                    </View>
                </View>

                {/* <View>
                    <View >
                        <Button title="Pick an image from camera roll" onPress={pickImage} />

                    </View>
                </View> */}

                <View style={[styles.textInputCont, { marginTop: 20 }]}>
                    <View style={styles.iconCont}>
                        <Image source={locationIcon} style={styles.icon} />
                    </View>

                    <TouchableOpacity onPress={openAddressPopup}>
                        <Text style={styles.formInputE}>{addressDetails}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.textInputCont}>
                    <View style={styles.iconCont}>
                        <Image source={locationIcon} style={styles.icon} />
                    </View>

                    <TouchableOpacity onPress={openCardPopup}>
                        <Text style={styles.formInputE}>{cardDetails}</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.textInputCont}>
                    <View style={styles.iconCont}>
                        <Image source={imgIcon} style={styles.icon} />
                    </View>

                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.formInputE}>Select Image</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.btnCon}>
                    <TouchableOpacity style={styles.siBtn} onPress={onSave}>
                        {/* <TouchableOpacity style={styles.siBtn} onPress={onSave} disabled={btnDisable}> */}
                        {/* <TouchableOpacity style={styles.siBtn}  onPress={() => navigation.navigate("Journals")}> */}
                        <Text style={styles.siBtnTxt}>Save</Text>
                    </TouchableOpacity>
                </View>



            </ScrollView>
            {popUpStatus ?
                <View style={styles.popUp}>
                    <View style={styles.popUpBox}>
                        <AddressComp setpopUpStatus={setpopUpStatus} />
                    </View>
                </View>
                : null}

            {popUpCardStatus ?
                <View style={styles.popUp}>
                    <View style={styles.popUpBox}>
                        <CardDetailsComp setpopUpCardStatus={setpopUpCardStatus} />
                    </View>
                </View>
                : null}

            {loadingStatus ?
                <View style={styles.loadingScreen}>
                    <Text style={{ fontSize: 18, color: "#7C9070", fontWeight: "bold" }}>Loading...</Text>
                </View>
                : null}
        </View >
    )
}

export default ProfileScreen

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
        height: 150,
        objectFit: "cover",
        // marginTop: -20
    },
    topBg: {
        position: "absolute",
        top: 30,
        backgroundColor: "#7C9070",
        zIndex: 10,
        height: 150,
        width: "100%",
        opacity: 0.5
    },
    // wrapper:{
    //   ma
    // },
    header: {
        // position: "absolute",
        // top: 310,
        marginVertical: 50,
        width: "84%",
        marginHorizontal: "8%",
        height: "auto"
    },
    title: {
        color: "#7C9070",
        fontSize: 36,
        fontWeight: "bold"
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
        width: "84%",
        marginHorizontal: "8%",
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
    formInputE: {
        width: "80%",
        marginLeft: 75,
        height: "100%",
        marginTop: 20
    },
    pswEye: {
        position: "absolute",
        right: 0,
        // backgroundColor: "yellow"
    },
    avaterImg: {
        width: 30,
        height: 30,
        marginHorizontal: 15,
        marginVertical: 15
    },
    siBtn: {
        width: "84%",
        marginHorizontal: "8%",
        height: 60,
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 20,
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
    accountCont: {
        marginTop: 30,
        // marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    // accountTxt: {
    //     marginLeft: 20
    // },
    signUpCont: {
        marginLeft: 5,
        color: "black"
    },
    signUpTxt: {
        color: "#7C9070"
    },
    buttonsCont: {
        marginBottom: 20,
        width: "84%",
        marginHorizontal: "8%",
        // height: 70,
        flexDirection: "row"
    },
    buttons: {
        width: "48%",
        marginRight: "2%",
        borderRadius: 50,
        // marginTop: 20,
        // marginHorizontal: "5%",
        // backgroundColor: "#7C9070",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonsText: {
        color: "#7C9070",
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