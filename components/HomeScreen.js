import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems } from "../services/serviceStoreDoc";

const HomeScreen = () => {
  const [items, setItems] = useState(null);
  const [popularItems, setPopularItems] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getItems();
      console.log("Res", res);
      setItems(res);

      var popular = []
      res.forEach(r => {
        if (r.itemStatus.stringValue === "popular") {
          
          popular.push(r);
        }
      });
      console.log("get pop", popular);


    })();
  }, [])

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"

  },
})