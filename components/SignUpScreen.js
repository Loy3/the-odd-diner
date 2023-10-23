import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { signUp } from "../services/serviceAuth";
import cover from "../assets/Images/cover.jpg";
import emailIcon from "../assets/Icons/email.png";
import passwIcon from "../assets/Icons/lock.png";
import pswdhide from "../assets/Icons/hide.png";
import pswdshow from "../assets/Icons/view.png";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ setSignIn }) => {
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [errorMSG, seterrorMSG] = useState("");
  const [errorMSGSts, seterrorMSGSts] = useState(false);
  const [passwordVis, setPasswordVis] = useState(true);
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("");
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [passStatus, setPassStatus] = useState(false);
  const [emailStatus, setEmailStatus] = useState(false);

  const [btnStatus, setBtnStatus] = useState(true);
  const [btnEmStatus, setBtnEmStatus] = useState(false);
  const [btnPsStatus, setBtnPsStatus] = useState(false);
  const [btnBgColor, setBtnBgColor] = useState("#E8F5E0");
  const [btnColor, setBtnColor] = useState("#7C9070");


  function handlePassword() {
    if (passwordVis === true) {
      setPasswordVis(false);
    } else if (passwordVis === false) {
      setPasswordVis(true);
    }
  }

  async function onSignUp() {
    // console.log(emailAddress, password);
    const user = await signUp(emailAddress, password);
    const res = await user;
    // console.log("My User", res);

    if (res.error) {
      console.log(res.error.message);
      seterrorMSG("Email already exists")
    } else {
      console.log("all is well");
      const jsonValue = JSON.stringify(res);
      await AsyncStorage.setItem('myUser', jsonValue).then(() => {
        console.log("Success");
        // setSignIn(true)
        seterrorMSG("");
        navigation.navigate("Profile")
      })
    }


  }

  //Validation
  useEffect(() => {
    handleEmail(emailAddress)
  }, [emailAddress])

  useEffect(() => {
    handlePassword(password)
  }, [password])

  useEffect(() => {
    handleBtn()
  }, [handleBtn])

  function handleEmail(email) {

    let new_email = email;


    var emailAddress = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*/g;

    if (new_email !== "") {
      if (!new_email.match(emailAddress)) {
        setErrorEmailMessage("Enter a required email address");
        // console.log(email);
        setEmailStatus(true);
        setBtnEmStatus(false);
      } else {
        setErrorEmailMessage("");
        setEmailStatus(false);
        setEmailAddress(new_email);
        setBtnEmStatus(true);
      }
    }
  }

  function handlePassword(pass) {
    let new_pass = pass;

    // regular expressions to validate password
    var lowerCase = /[a-z]/g;
    var upperCase = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var specialChar = /[!@#$%^&*]/g;

    if (new_pass !== "") {
      // setErrorPasswordMessage("Password length should be more than 8.");
      // setPassStatus(true);
      // setBtnPsStatus(false);


      if (!new_pass.match(lowerCase)) {
        setErrorPasswordMessage("Password should contains at least 1 or more lowercase letter(s)!");
        setPassStatus(true);
        setBtnPsStatus(false);
      } else if (!new_pass.match(upperCase)) {
        setErrorPasswordMessage("Password should contain at least 1 or more uppercase letter(s)!");
        setPassStatus(true);
        setBtnPsStatus(false);
      } else if (!new_pass.match(numbers)) {
        setErrorPasswordMessage("Password should contains numbers also!");
        setPassStatus(true);
        setBtnPsStatus(false);
      } else if (new_pass.length < 8) {
        setErrorPasswordMessage("Password length should be more than 8.");
        setPassStatus(true);
        setBtnPsStatus(false);
      } else if (!new_pass.match(specialChar)) {
        setErrorPasswordMessage("Password should contain at least 1 special character");
        setPassStatus(true);
        setBtnPsStatus(false);
      } else {
        setErrorPasswordMessage("Password is strong!");
        setPassStatus(false);
        setPassword(new_pass);
        setBtnPsStatus(true);
      }
    }
  }

  function handleBtn() {
    // console.log(btnEmStatus, btnPsStatus);
    if (btnEmStatus === true && btnPsStatus === true) {
      setBtnStatus(false);
      setBtnBgColor("#7C9070");
      setBtnColor("#FFFEF5")
    } else {
      setBtnStatus(true);
      setBtnBgColor("#E8F5E0");
      setBtnColor("#7C9070")
    }

  }

  function handlePasswordVis() {
    if (passwordVis === true) {
      setPasswordVis(false);
    } else if (passwordVis === false) {
      setPasswordVis(true);
    }
  }
  //Validation

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true} >
        <View style={styles.topImg} >
          <Image source={cover} style={styles.landingImg} />
        </View>
        <View style={styles.topBg} />

        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subTitle}>Sign Up to create an account.</Text>
        </View>
        {errorMSG !== "" ?
          <Text style={{
            color: "red", marginBottom: 10,
            marginTop: -30, marginLeft: 10, marginLeft: "8%"
          }}>{errorMSG}</Text>
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
        {emailStatus === true ?
          <View style={{ marginLeft: "10%", marginTop: 10 }}>
            <Text style={{ fontStyle: "italic", fontSize: 12, color: "red" }}>{errorEmailMessage}</Text>
          </View>
          : null}

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
          <TouchableOpacity style={styles.pswEye} onPress={handlePasswordVis}>
            {passwordVis === true ? <Image source={pswdhide} style={styles.avaterImg} />
              : <Image source={pswdshow} style={styles.avaterImg} />}
          </TouchableOpacity>

        </View>
        {passStatus === true ?
          <View style={{ marginLeft: "10%", marginTop: 10 }}>
          <Text style={{ fontStyle: "italic", fontSize: 12, color: "red" }}>{errorPasswordMessage}</Text>
          </View>
          : null}

        <View style={styles.btnCon}>
          <TouchableOpacity style={[styles.siBtn, { backgroundColor: btnBgColor }]} onPress={onSignUp} disabled={btnStatus}>
            <Text style={[styles.siBtnTxt, { color: btnColor }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.accountCont}>
          <Text style={styles.accountTxt}>
            Already have an account?
          </Text>
          <TouchableOpacity style={styles.signUpCont}
            onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signUpTxt}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View >
  )
}

export default SignUpScreen

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