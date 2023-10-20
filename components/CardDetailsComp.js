import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userIcon from "../assets/Icons/id2.png";
import closeBtnIcon from "../assets/Icons/close.png";

const CardDetailsComp = ({ setpopUpCardStatus }) => {
  const [cardName, setcardName] = useState("");
  const [cardNum, setcardNum] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cardDate, setcardDate] = useState("");
  const [warningMsg, setWarningMsg] = useState("")
  const [warningStatus, setWarningStatus] = useState(false);

  async function onSave() {
    if (cardName === "" || cardNum === "" || zipCode === "" || cardDate === "") {
      setWarningMsg("Fields shouldn't be left empty");
      setWarningStatus(true)
    } else {
      setWarningMsg("");
      setWarningStatus(false)
      console.log(cardName);
      const res = {
        cardName: cardName,
        cardNum: cardNum,
        zipCode: zipCode,
        cardDate: cardDate
      }

      const jsonValue = JSON.stringify(res);
      await AsyncStorage.setItem('cardDetails', jsonValue).then(() => {
        console.log("Success");
        setpopUpCardStatus(false);
      })
    }
  }

  function onClose(){
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
            keyboardType="numeric"
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

export default CardDetailsComp


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
    backgroundColor:"#FFFEF5",
    borderWidth: 2,
    borderColor: "#7C9070",
    borderRadius: 60,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems:"center",

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