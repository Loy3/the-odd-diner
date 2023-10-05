import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersScreen = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const monthOfYear = monthsOfYear[today.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthOfYear}`;
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
      });

      useEffect(() => {
        (async () => {
          setloadingStatusStatus(true);
          await getUser().then(async () => {
            const res = await getItems();
            
            setloadingStatusStatus(false)
          })
        })();
    
      }, [])
    
      async function getUser() {
        const jsonValue = await AsyncStorage.getItem('user');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
    
        const user = await getUsers(res.localId)
        // console.log("Ress", res);
        console.log("signed in user", user[0].lastname.stringValue);
        setSignedInUser({
          firstname: user[0].firstname.stringValue,
          lastname: user[0].lastname.stringValue,
          imageUrl: user[0].imageUrl.stringValue,
          emailAddress: res.email,
          userID: res.localId
        });
        // return null;
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

            <ScrollView scrollEnabled={true} >
                <>
                    <View>
                        <Text>OrdersScreen</Text>
                    </View>

                </>
            </ScrollView>
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