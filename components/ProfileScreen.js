import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';
import { signIn } from "../services/serviceAuth";
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
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [userImage, setUserImage] = useState(null);


    const [passwordVis, setPasswordVis] = useState(true);
    const [warningMsg, setWarningMsg] = useState("")
    const [warningStatus, setWarningStatus] = useState(false)
    const [errorMSG, seterrorMSG] = useState("");

    const [popUpStatus, setpopUpStatus] = useState(false)
    const [popUpCardStatus, setpopUpCardStatus] = useState(false)

    useEffect(() => {
        (async () => {
            const user = await getUser();
            // console.log("The user", user);
            if (user !== null) {
                console.log("user", user.email)
                setEmailAddress(user.email)
            } else {
                console.log("Not Signed In");
            }

        })();
    }, [getUser]);

    async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        // const jsonValue = await AsyncStorage.removeItem('user');

        // const user = JSON.parse(jsonValue);
        // console.log("RTN User", JSON.parse(jsonValue));

        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }

    useEffect(() => {
        (async () => {
            const address = await getAddress();
            // console.log("The user", user);
            if (address !== null) {
                console.log("Address", address.city)
            } else {
                console.log("Not Signed In");
            }

        })();
    }, [getAddress]);

    async function getAddress() {
        const jsonValue = await AsyncStorage.getItem('physicalAddress');
        // const jsonValue = await AsyncStorage.removeItem('user');

        // const user = JSON.parse(jsonValue);
        // console.log("RTN User", JSON.parse(jsonValue));

        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }

    async function onSave() {
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

        console.log(result);

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
                            value={phoneNum} placeholder={"Enter your email address:"} />
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
                        <Text style={styles.formInputE}>Enter Physical Address</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.textInputCont}>
                    <View style={styles.iconCont}>
                        <Image source={locationIcon} style={styles.icon} />
                    </View>

                    <TouchableOpacity onPress={openCardPopup}>
                        <Text style={styles.formInputE}>Enter Card Details</Text>
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
})