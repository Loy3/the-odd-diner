import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LaunchScreen from './components/LaunchScreen';
import React, { useState, useEffect, useRef } from 'react';
import SignUpScreen from './components/SignUpScreen';
import SignInScreen from './components/SignInScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App({ navigation }) {
  const Stack = createStackNavigator();
  const [isSignedIn, setSignIn] = useState(null);

  return (
    <NavigationContainer>
      {/* <AppStack.Navigator screenOptions={{ headerShown: true }} > */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="LaunchPage" component={LaunchScreen} />
        <Stack.Screen name="SignIn">
          {() => <SignInScreen setSignIn={setSignIn} />}
        </Stack.Screen> */}
        {/* <Stack.Screen name="SignUp">
          {() => <SignUpScreen setSignIn={setSignIn} />}
        </Stack.Screen> */}
        <Stack.Screen name="Profile">
          {() => <ProfileScreen setSignIn={setSignIn} />}
        </Stack.Screen>
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
