import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideNavComp from './SideNavComp';

const ViewProfileScreen = () => {
    const [loadingStatus, setloadingStatusStatus] = useState(false);
    const [signedInUser, setSignedInUser] = useState({
        firstname: null,
        lastname: null,
        imageUrl: null,
        emailAddress: null
    });

    const [menuStatus, setMenuStatus] = useState(false);
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
      
    function openMenu() {
        setMenuStatus(true);
    }

    return (
        <View style={styles.container}>

            <ScrollView scrollEnabled={true} >
                <>
                    <Text>ViewProfileScreen</Text>
                </>
            </ScrollView>

            {menuStatus ?
                <SideNavComp setMenuStatus={setMenuStatus} />
                : null}
        </View>
    )
}

export default ViewProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#FFFEF5',
        width: "100%",
    },
})