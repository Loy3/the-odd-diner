import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { authUrl, refreshTkn } from "./services/serviceAuth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LaunchScreen from './components/LaunchScreen';
import React, { useState, useEffect, useRef } from 'react';
import SignUpScreen from './components/SignUpScreen';
import SignInScreen from './components/SignInScreen';
import ProfileScreen from './components/ProfileScreen';
import HomeScreen from './components/HomeScreen';
import ViewItemScreen from './components/ViewItemScreen';
import CartScreen from './components/CartScreen';
import CheckOutScreen from './components/CheckOutScreen';
import ViewProfileScreen from './components/ViewProfileScreen';
import OrderReviewScreen from './components/OrderReviewScreen';
import OrdersScreen from './components/OrdersScreen';

export default function App({ navigation }) {
  const Stack = createStackNavigator();
  const [isSignedIn, setSignIn] = useState(null);
  const [status, setstatus] = useState("");
  const [userMail, setUserMail] = useState("");

  useEffect(() => {
    (async () => {
      const user = await getUser();
      // console.log("The user", user);
      if (user !== null) {
        // console.log("user",user.email)
        setUserMail(user.email)
        setstatus("Signed In");
        if (user.email) {
          setSignIn(true);
        }
      } else {
        setstatus("Not Signed In");
        // console.log("Not Signed In");
        setSignIn(false);
      }

    })();
  }, [getUser]);

  async function getUser() {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      // const jsonValue = await AsyncStorage.removeItem('user');

      const user = JSON.parse(jsonValue);
      // console.log("RTN User", JSON.parse(jsonValue));
      if (user !== null) {
        const token = user.idToken;
        const refTkn = user.refreshToken;
        // console.log(user.expiresIn);
        checkTokenExp(token, user.expiresIn).then(async (isValid) => {
          if (isValid) {
            // console.log("My brother we are moving");
            // setSignIn(true);

            return jsonValue != null ? JSON.parse(jsonValue) : null;
          } else {
            console.log("Token invalid");
            await refreshTkn(refTkn);
            //refresh token here
            return null;
          }
        }).catch((error) => {
          console.log("Error", error);
        })
      }
      return jsonValue != null ? JSON.parse(jsonValue) : null;

      // return null;
    } catch (e) {
      console.log(e.message);
    }
  }

  async function checkTokenExp(token, expiresIn) {
    const url = authUrl;
    const idToken = token;
    const response = await fetch(url, {
      method: "POST",
      headers: { 'ContentType': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (response.ok) {
      const data = await response.json();
      const user = data.users[0];
      // console.log("===", user, data);
      if (user) {
        // console.log("the user", expiresIn);
        let expTime = user.validSince + expiresIn;;
        const now = Math.floor(Date.now() / 1000);
        // console.log("exp", expTime, "now", now);
        if (expTime > now) {
          console.log("Still Valid");
          return true
        }
      }
    }
    return false;
  }

  return (
    <NavigationContainer>
      {/* <AppStack.Navigator screenOptions={{ headerShown: true }} > */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {isSignedIn ? (
          <>
             <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Item" component={ViewItemScreen} />
             <Stack.Screen name="Cart" component={CartScreen} />
             <Stack.Screen name="Review" component={OrderReviewScreen} />  
            <Stack.Screen name="Checkout" component={CheckOutScreen} /> 
            <Stack.Screen name="ViewProfile" component={ViewProfileScreen} /> 
            <Stack.Screen name="Orders" component={OrdersScreen} /> 
          </>

        )
          :
          (
            <>
              <Stack.Screen name="LaunchPage" component={LaunchScreen} />
              <Stack.Screen name="SignIn">
                {() => <SignInScreen setSignIn={setSignIn} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {() => <SignUpScreen setSignIn={setSignIn} />}
              </Stack.Screen>
              <Stack.Screen name="Profile">
                {() => <ProfileScreen setSignIn={setSignIn} />}
              </Stack.Screen>
            </>
          )

        }
        {/* {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} initialParams={{ userMail }} />
            <Stack.Screen name="Journals" component={JournalsScreen} initialParams={{ userMail }} />
            <Stack.Screen name="SignOut" >
              {() => <SignOutScreen setSignIn={setSignIn} />}
            </Stack.Screen>
          </>

        )
          :
          (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="SignIn">
                {() => <SignInScreen setSignIn={setSignIn} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {() => <SignUpScreen setSignIn={setSignIn} />}
              </Stack.Screen>
            </>
          )

        } */}
        {/* <AppStack.Screen name="DefaultScreen" component={DefaultScreen} options={{ headerShown: false }} /> */}


      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
