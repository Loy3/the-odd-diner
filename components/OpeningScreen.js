import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import cover from "../assets/Icons/table.png";
const OpeningScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.topImg} >
                <Image source={cover} style={styles.landingImg} />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.titleCont}>
                    <Text style={styles.title}>Journal Recorder</Text>
                    <Text style={styles.subTitle}>Welcome to the Journal Recorder App, a place where you can record your own journal.</Text>
                </View>

                <View style={styles.proceed}>
                    <TouchableOpacity style={styles.proceedBTN}
                        onPress={() => navigation.navigate("SignIn")}>
                        <Text style={styles.proceedBtnTxt}>PROCEED</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.proceedBTN}
                        onPress={() => navigation.navigate("SignIn")}>
                        <Text style={styles.proceedBtnTxt}>PROCEED</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default OpeningScreen

const styles = StyleSheet.create({})