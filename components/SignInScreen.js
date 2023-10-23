import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { signIn } from "../services/serviceAuth";
import cover from "../assets/Images/cover.jpg";
import emailIcon from "../assets/Icons/email.png";
import passwIcon from "../assets/Icons/lock.png";
import pswdhide from "../assets/Icons/hide.png";
import pswdshow from "../assets/Icons/view.png";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ setSignIn }) => {
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");


  const [passwordVis, setPasswordVis] = useState(true);
  const [warningMsg, setWarningMsg] = useState("")
  const [warningStatus, setWarningStatus] = useState(false)
  const [errorMSG, seterrorMSG] = useState("");

  function handlePassword() {
    if (passwordVis === true) {
      setPasswordVis(false);
    } else if (passwordVis === false) {
      setPasswordVis(true);
    }
  }

  async function onSignin() {
    // console.log(emailAddress, password);
    if (password === "" || emailAddress === "") {
      setWarningStatus(true)
      setWarningMsg("Email or Password required")
    } else {
      const user = await signIn(emailAddress, password);
      const res = await user;
      // console.log("My User", res);

      if (res.error) {
        console.log(res.error.message);
        setWarningStatus(true)
        setWarningMsg("Email or Password is invalid")
      } else {
        setWarningStatus(true)
        setWarningMsg("")
        // console.log("all is well");
        const jsonValue = JSON.stringify(res);
        await AsyncStorage.setItem('user', jsonValue).then(() => {
          console.log("Success");
          setSignIn(true)
        })
      }
    }

  }

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true} >
        <View style={styles.topImg} >
          <Image source={cover} style={styles.landingImg} />
        </View>
        <View style={styles.topBg} />

        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subTitle}>Sign In to continue.</Text>
        </View>

        {warningStatus ?
          <Text style={{
            color: "red", marginBottom: 10,
            marginTop: -30, marginLeft: 10, marginLeft: "8%"
          }}>{warningMsg}</Text>
          : null}

        <View style={styles.textInputCont}>
          <View style={styles.iconCont}>
            <Image source={emailIcon} style={styles.icon} />
          </View>

          <View>
            <TextInput style={styles.formInput}
              autoComplete="off"
              keyboardType="visible-password"
              autoCapitalize="none"
              onChangeText={text => setEmailAddress(text)}
              value={emailAddress} placeholder={"Enter your email address:"} />
          </View>
        </View>

        <View style={[styles.textInputCont, { marginTop: 20 }]}>
          <View style={styles.iconCont}>
            <Image source={passwIcon} style={styles.icon} />
          </View>

          <View>
            <TextInput style={styles.formInput}
              secureTextEntry={passwordVis}
              autoComplete="off"
              autoCapitalize="none"
              onChangeText={text => setPassword(text)}
              value={password} placeholder={"Password"} />
          </View>
          <TouchableOpacity style={styles.pswEye} onPress={handlePassword}>
            {passwordVis === true ? <Image source={pswdhide} style={styles.avaterImg} />
              : <Image source={pswdshow} style={styles.avaterImg} />}
          </TouchableOpacity>
        </View>

        <View style={styles.btnCon}>
          <TouchableOpacity style={styles.siBtn} onPress={onSignin}>
            {/* <TouchableOpacity style={styles.siBtn}  onPress={() => navigation.navigate("Journals")}> */}
            <Text style={styles.siBtnTxt}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.accountCont}>
          <Text style={styles.accountTxt}>
            Don't have an account?
          </Text>
          <TouchableOpacity style={styles.signUpCont}
            onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpTxt}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View >
  )
}

export default SignInScreen

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
    height: 250,
    objectFit: "cover",
    // marginTop: -20
  },
  topBg: {
    position: "absolute",
    top: 30,
    backgroundColor: "#7C9070",
    zIndex: 99,
    height: 250,
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
  textInputCont: {
    width: "84%",
    marginHorizontal: "8%",
    height: 67,
    backgroundColor: "#FFFEF5",
    borderColor: "#7C9070",
    borderRadius: 50,
    borderWidth: 2,
    // alignItems: "center",
    justifyContent: "center"
  },
  iconCont: {
    position: "absolute",
    left: -2,
    top: -2,
    width: 70,
    height: 67,
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
    height: 70,
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
    fontSize: 18,
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
})