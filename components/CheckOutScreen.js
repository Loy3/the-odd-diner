import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckOutScreen = ({ navigation }) => {
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
    });
    const [items, setItems] = useState([]);
// useEffect(()=>{
//     navigation.navigate("Cart")
// },[])

useEffect(() => {
    (async () => {
        // setloadingStatusStatus(true);
        await getUser().then(async (user) => {
           
            // console.log(res);
            if (user === null) {
                navigation.navigate("Home")
            }else{
                await getCheckoutItems();
            }
            // setloadingStatusStatus(false)
        })
    })();

}, [])

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
    return res;
}

async function getCheckoutItems(){
    const jsonValue = await AsyncStorage.getItem('checkout');
    const res = jsonValue != null ? JSON.parse(jsonValue) : null;
    console.log("Ress", res.items[0]);
}

  return (
    <View style={styles.container}>
    <ScrollView scrollEnabled={true} >
        <>
            

        </>
    </ScrollView>

</View>
  )
}

export default CheckOutScreen

const styles = StyleSheet.create({})