import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import menuIcon from "../assets/Icons/menu.png";

import bfIcon from "../assets/Icons/breakfast.png";
import bevIcon from "../assets/Icons/bev.png";
import lnIcon from "../assets/Icons/lunch.png";
import dinIcon from "../assets/Icons/dinner.png";

import userIcon from "../assets/Icons/user2.png";
import addIcon from "../assets/Icons/add.png";
import subImg from "../assets/Images/1.jpg";
import popularBtnLeft from "../assets/Icons/prev.png";
import popularBtnRight from "../assets/Icons/next.png";
import prepTimeIcon from "../assets/Icons/stopwatch2.png";
import priceIcon from "../assets/Icons/money.png";
import starIcon from "../assets/Icons/star.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideNavComp from './SideNavComp';

const HomeScreen = () => {
  const [loadingStatus, setloadingStatusStatus] = useState(false);
  const [items, setItems] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [popularItems, setPopularItems] = useState({
    id: "",
    itemImageUrl: "",
    itemName: "",
    itemSub: "",
    itemPrepTime: "",
    itemPrice: "",
  });

  const [storePopularItems, setStorePopularItems] = useState([]);
  const [signedInUser, setSignedInUser] = useState({
    firstname: null,
    lastname: null,
    imageUrl: null,
    emailAddress: null
  });

  // popularDets = {
  //   id: "",
  //   itemImageUrl:"",
  //   itemName: "",
  //   itemSub: "",
  //   itemPrepTime: "",
  //   itemPrice: "",
  // }

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
      await getUser().then(async () => {
        const res = await getItems();
        // console.log("Res", res[0]);
        setItems(res);
        setStoreItems(res);
        var popular = []
        res.forEach(r => {
          // console.log("================================");
          // console.log("Res", r);
          // console.log("================================");
          if (r.itemStatus.stringValue === "popular") {

            const popularDets = {
              id: r.id,
              itemImageUrl: r.itemImageUrl.stringValue,
              itemName: r.itemName.stringValue,
              itemSub: r.itemSub.stringValue,
              itemPrepTime: r.itemPrepTime.stringValue,
              itemPrice: r.itemPrice.stringValue,
            }
            popular.push(popularDets);
          }
        });
        setStorePopularItems(popular)
        // console.log("get pop", popular);
        setPopularItems({
          id: popular[0].id,
          itemImageUrl: popular[0].itemImageUrl,
          itemName: popular[0].itemName,
          itemSub: popular[0].itemSub,
          itemPrepTime: popular[0].itemPrepTime,
          itemPrice: popular[0].itemPrice,
        });
        setloadingStatusStatus(false)
      })
    })();

  }, [])

  async function getUser() {
    const jsonValue = await AsyncStorage.getItem('user');
    const res = jsonValue != null ? JSON.parse(jsonValue) : null;
    // console.log("Ress", user[0]);
    const user = await getUsers(res.localId)
    console.log("signed in user", user[0].lastname.stringValue);
    setSignedInUser({
      firstname: user[0].firstname.stringValue,
      lastname: user[0].lastname.stringValue,
      imageUrl: user[0].imageUrl.stringValue,
      emailAddress: res.email
    });
    // return null;
  }

  function nextPopular(type) {
    var itemIndex = 0;
    // console.log(storePopularItems);
    for (let p = 0; p < storePopularItems.length; p++) {
      if (storePopularItems[p].itemName === type) {
        itemIndex = p;
        // console.log("first", itemIndex);
        itemIndex++;
      }
    }
    // console.log(itemIndex);
    const arrLength = storePopularItems.length - 1;
    // console.log(arrLength);
    if (itemIndex <= arrLength) {
      setPopularItems({
        id: storePopularItems[itemIndex].id,
        itemImageUrl: storePopularItems[itemIndex].itemImageUrl,
        itemName: storePopularItems[itemIndex].itemName,
        itemSub: storePopularItems[itemIndex].itemSub,
        itemPrepTime: storePopularItems[itemIndex].itemPrepTime,
        itemPrice: storePopularItems[itemIndex].itemPrice,
      });
    } else {
      setPopularItems({
        id: storePopularItems[0].id,
        itemImageUrl: storePopularItems[0].itemImageUrl,
        itemName: storePopularItems[0].itemName,
        itemSub: storePopularItems[0].itemSub,
        itemPrepTime: storePopularItems[0].itemPrepTime,
        itemPrice: storePopularItems[0].itemPrice,
      });
    }

  }

  function prevPopular(type) {
    var itemIndex = 0;
    // console.log(storePopularItems);
    for (let p = 0; p < storePopularItems.length; p++) {
      if (storePopularItems[p].itemName === type) {
        itemIndex = p;
        itemIndex--;
      }
    }
    // console.log(itemIndex);
    const arrLength = storePopularItems.length - 1;
    if (itemIndex < 0) {
      setPopularItems({
        id: storePopularItems[arrLength].id,
        itemImageUrl: storePopularItems[arrLength].itemImageUrl,
        itemName: storePopularItems[arrLength].itemName,
        itemSub: storePopularItems[arrLength].itemSub,
        itemPrepTime: storePopularItems[arrLength].itemPrepTime,
        itemPrice: storePopularItems[arrLength].itemPrice,
      });
    } else {
      setPopularItems({
        id: storePopularItems[itemIndex].id,
        itemImageUrl: storePopularItems[itemIndex].itemImageUrl,
        itemName: storePopularItems[itemIndex].itemName,
        itemSub: storePopularItems[itemIndex].itemSub,
        itemPrepTime: storePopularItems[itemIndex].itemPrepTime,
        itemPrice: storePopularItems[itemIndex].itemPrice,
      });
    }

  }

  function changeDotColor(type) {
    var itemIndex = 0;
    // console.log(storePopularItems);
    for (let p = 0; p < storePopularItems.length; p++) {
      if (storePopularItems[p].itemName === type) {
        itemIndex = p;
        // console.log("first", itemIndex);
        // itemIndex++;
      }
    }
    // console.log(itemIndex);
    return itemIndex
  }



  function filterItems(type) {
    let itemsStore = [];
    switch (type) {
      case "breakfast":
        storeItems.forEach(item => {
          if (item.itemCategory.stringValue === "breakfast") {
            itemsStore.push(item);
          }
        });
        break;
      case "bev":
        storeItems.forEach(item => {
          if (item.itemCategory.stringValue === "beverages") {
            itemsStore.push(item);
          }
        });
        break;
      case "lunch":
        storeItems.forEach(item => {
          if (item.itemCategory.stringValue === "lunch") {
            itemsStore.push(item);
          }
        });
        break;
      case "dinner":
        storeItems.forEach(item => {
          if (item.itemCategory.stringValue === "dinner") {
            itemsStore.push(item);
          }
        });
        break;
      default:
        itemsStore = storeItems;
    }

    setItems(itemsStore);
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
          <View style={styles.header}>
            <View style={styles.menuCont}>
              <TouchableOpacity style={styles.menuBtn}>
                <Image source={menuIcon} style={styles.menu} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTextCont}>
              <Text style={styles.headerDate}>{formattedDate}</Text>
              <Text style={styles.headerUser}>{`Hello! ${signedInUser.firstname === null ? "First Name" : signedInUser.firstname} ${signedInUser.lastname === null ? "Last Name" : signedInUser.lastname}`}</Text>
            </View>
            <View style={styles.headerImageCont}>
              <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
            </View>

            <View style={styles.popularCont}>
              <Image source={popularItems.itemImageUrl === "" ? subImg : { uri: popularItems.itemImageUrl }} style={styles.popularImg} />
              <View style={styles.popularBg} />

              <TouchableOpacity style={styles.popularBtnLeftCont} onPress={() => prevPopular(popularItems.itemName)} >
                <Image source={popularBtnLeft} style={styles.popularBtnLeft} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.popularBtnRightCont} onPress={() => nextPopular(popularItems.itemName)}>
                <Image source={popularBtnRight} style={styles.popularBtnRight} />
              </TouchableOpacity>

              <View style={styles.popularDetailsCont}>
                <Image source={starIcon} style={styles.starIcon} />
                <Text style={styles.popularDetailsTitle}>{popularItems.itemName}</Text>
                <Text style={styles.popularDetailsSub}>{popularItems.itemSub}</Text>
                <View style={styles.line} />

                <View style={{ marginHorizontal: 10, flexDirection: "row", width: "95%" }}>

                  <View style={styles.mostPopCont}>
                    <Text style={styles.mostPop}>Most Popular</Text>
                  </View>

                  <View style={styles.prepTimeCont}>
                    <Image source={prepTimeIcon} style={styles.prepTimeIc} />
                    <Text style={styles.prepTimeText}>{popularItems.itemPrepTime}</Text>
                  </View>

                  <View style={styles.priceCont}>
                    <Image source={priceIcon} style={styles.prepTimeIc} />
                    <Text style={styles.prepTimeText}>{`R${popularItems.itemPrice}.00`}</Text>
                  </View>

                </View>
              </View>

            </View>



          </View>
          <View style={styles.dotsCont}>
            {/* <View style={styles.dots2} /> */}
            {storePopularItems.map((dot, index) => (
              <View key={index}>
                <View style={index === changeDotColor(popularItems.itemName) ? styles.dots2 : styles.dots} />
              </View>
            ))}
          </View>

          <View style={styles.filterBtnCont}>
            <View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => filterItems("all")}>
                <Image source={bfIcon} style={styles.filterBtnImg} />
              </TouchableOpacity>
              <Text style={styles.filterBtnTxt}>All</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => filterItems("breakfast")}>
                <Image source={bfIcon} style={styles.filterBtnImg} />
              </TouchableOpacity>
              <Text style={styles.filterBtnTxt}>Breakfast</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => filterItems("bev")}>
                <Image source={bevIcon} style={styles.filterBtnImg} />
              </TouchableOpacity>
              <Text style={styles.filterBtnTxt}>Beverages</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => filterItems("lunch")}>
                <Image source={lnIcon} style={styles.filterBtnImg} />
              </TouchableOpacity>
              <Text style={styles.filterBtnTxt}>Lunch</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => filterItems("dinner")}>
                <Image source={dinIcon} style={styles.filterBtnImg} />
              </TouchableOpacity>
              <Text style={styles.filterBtnTxt}>Dinner</Text>
            </View>
          </View>
          <View style={[styles.line, { marginHorizontal: 25, marginTop: 20 }]} />

          <Text style={styles.itemTitle}>Featured Items:</Text>

          <View style={styles.itemsCont}>
            {items ?
              items.map((item, index) => (
                <View style={styles.itemsCol} key={index}>
                  <View style={styles.itemsCard}>
                    <Image source={item.itemImageUrl.stringValue ? { uri: item.itemImageUrl.stringValue } : subImg} style={styles.itemImg} />
                    <View style={styles.cardPriceCont}>
                      <Text style={styles.cardPrice}>{item.itemPrice.stringValue ? `R${item.itemPrice.stringValue}.00` : "R00.00"}</Text>
                    </View>
                    <Text style={styles.cardItem}>{item.itemName.stringValue ? `${item.itemName.stringValue}` : "Title"}</Text>

                    <View style={styles.cardPrepTimeCont}>
                      <Image source={prepTimeIcon} style={styles.cardPrepTimeIc} />
                      <Text style={styles.cardPrepTimeText}>10-15min</Text>
                    </View>

                    <TouchableOpacity style={styles.addToCart}>
                      <Image source={addIcon} style={styles.prepTimeIc} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
              :
              <View style={styles.itemsCol}>
                <View style={styles.itemsCard}>
                  <Image source={subImg} style={styles.itemImg} />
                  <View style={styles.cardPriceCont}>
                    <Text style={styles.cardPrice}>R150.00</Text>
                  </View>
                  <Text style={styles.cardItem}>Title</Text>

                  <View style={styles.cardPrepTimeCont}>
                    <Image source={prepTimeIcon} style={styles.cardPrepTimeIc} />
                    <Text style={styles.cardPrepTimeText}>10-15min</Text>
                  </View>

                  <TouchableOpacity style={styles.addToCart}>
                    <Image source={prepTimeIcon} style={styles.cardPrepTimeIc} />
                  </TouchableOpacity>
                </View>
              </View>
            }

          </View>
        </>

      </ScrollView>


      <SideNavComp />

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  line: {
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "#7C9070",
    marginHorizontal: 10,
    marginVertical: 10
  },
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: '#FFFEF5',
    width: "100%",
  },
  header: {
    position: "relative",
    width: "100%",
    paddingTop: 50,
    height: "auto",
    backgroundColor: "#7C9070",
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
  },
  menuCont: {
    marginHorizontal: 30,
    marginTop: 10
  },
  menuBtn: {},
  menu: {
    width: 30,
    height: 30
  },

  headerTextCont: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  headerDate: {
    color: "#FFFEF5",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 5
  },
  headerUser: {
    color: "#FFFEF5",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5
  },
  headerImageCont: {
    position: 'absolute',
    top: 60,
    right: 20,

  },
  headerImage: {

    width: 100,
    height: 100,
    objectFit: "cover",
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#FFFEF5"
  },

  popularCont: {
    marginTop: 10,
    height: 350,
    width: "92%",
    marginHorizontal: "4%",
    // backgroundColor: "yellow",
  },
  popularImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  popularBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "gray",
    zIndex: 10,
    opacity: 0.05
  },

  popularBtnLeftCont: {
    position: "absolute",
    top: "30%",
    left: -13,
    backgroundColor: "#FFFEF5",
    height: 60,
    width: 60,
    zIndex: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  popularBtnLeft: {
    width: 25,
    height: 25,
    objectFit: "cover",
    marginLeft: -5
  },

  popularBtnRightCont: {
    position: "absolute",
    top: "30%",
    right: -13,
    backgroundColor: "#FFFEF5",
    height: 60,
    width: 60,
    zIndex: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  popularBtnRight: {
    width: 25,
    height: 25,
    objectFit: "cover",
    marginRight: -5
  },
  popularDetailsCont: {
    position: "absolute",
    bottom: "2%",
    left: 0,
    marginHorizontal: "2%",
    backgroundColor: "#FFFEF5",
    height: 145,
    width: "96%",
    zIndex: 30,

    // alignItems:"center",
    // justifyContent:"center"
  },
  starIcon: {
    width: 30,
    height: 30,
    position: "absolute",
    top: 10,
    right: 10
  },
  popularDetailsTitle: {
    fontSize: 24,
    color: "#7C9070",
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 10
  },
  popularDetailsSub: {
    fontSize: 18,
    color: "#A8C099",
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 5
  },

  mostPopCont: {
    width: "30%",
    justifyContent: "center"
  },
  mostPop: {
    color: "#A8C099",
    fontSize: 13,
    fontWeight: "700",

  },
  prepTimeCont: {
    width: "40%",
    // backgroundColor:"yellow",
    flexDirection: "row",
    alignItems: "center",
  },
  prepTimeIc: {
    width: 20,
    height: 20
  },
  prepTimeText: {
    marginLeft: 2,
    color: "#7C9070",
    fontSize: 14,
    fontWeight: "700",
  },
  priceCont: {
    width: "30%",
    // backgroundColor:"green",
    flexDirection: "row",
    alignItems: "center",
  },
  dotsCont: {
    width: "100%",
    height: 30,
    // backgroundColor: "yellow",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center"
    // position: "absolute",
    // bottom: -20,
    // zIndex: 40
  },
  dots: {
    height: 15,
    width: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    margin: 2
  },

  dots2: {
    height: 15,
    width: 15,
    backgroundColor: "#7C9070",
    borderRadius: 10,
    margin: 2
  },

  filterBtnCont: {
    width: "100%",
    height: 100,
    // backgroundColor: "yellow",
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  filterBtn: {
    width: 70,
    height: 70,
    // backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    borderRadius: 100,
    shadowColor: "#7C9070", // IOS
    shadowOffset: { height: 3, width: 3 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 30, //IOS
    backgroundColor: "#FFFEF5",
    elevation: 5, // Android
  },
  filterBtnImg: {
    width: 40,
    height: 40
  },
  filterBtnTxt: {
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#7C9070",
    // backgroundColor:"yellow"
  },
  itemTitle: {
    marginVertical: 20,
    marginHorizontal: 30,
    color: "#7C9070",
    fontWeight: "bold",
    fontSize: 16
  },
  itemsCont: {
    marginVertical: 20,
    marginHorizontal: "1%",
    width: "98%",
    // height: 500,
    // backgroundColor: "yellow",
    flexDirection: 'row',
    flexWrap: "wrap"
  },
  itemsCol: {
    // flex: "45%",
    width: "48%",
    height: "auto",
    backgroundColor: "#F5F5F5",
    marginVertical: 10,
    marginHorizontal: "1%",
  },
  itemImg: {
    width: "100%",
    height: 200,
    objectFit: "cover"
  },

  cardPriceCont: {
    backgroundColor: "#FFFEF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "60%",
    position: "absolute",
    top: 160,
    left: 3
  },
  cardPrice: {
    fontSize: 18,
    color: "#7C9070",
    fontWeight: "bold"
  },
  cardItem: {
    marginVertical: 10,
    marginHorizontal: 5,
    color: "#7C9070",
    fontWeight: "bold",
    fontSize: 20
  },
  cardPrepTimeCont: {
    marginTop: 10,
    marginLeft: 5,
    width: "50%",
    // backgroundColor:"yellow",
    flexDirection: "row",
    alignItems: "center",
  },
  cardPrepTimeIc: {
    width: 23,
    height: 23
  },
  cardPrepTimeText: {
    marginLeft: 2,
    color: "#7C9070",
    fontSize: 14,
    fontWeight: "700",
  },
  addToCart: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: "#7C9070",
    justifyContent: "center",
    alignItems: "center"
  },
  // sideNavCont: {
  //   backgroundColor: "rgba(0,0,0,0.5)",
  //   // opacity: 0.5,
  //   position: "absolute",
  //   height: "100%",
  //   width: "100%",
  //   zIndex: 99,
  //   top: 0,
  //   left: 0,
  //   alignItems: "center",
  //   justifyContent: "center"
  // },
  // sideNavBox: {
  //   backgroundColor: "#FFFEF5",
  //   // opacity: 0.5,
  //   position: "absolute",
  //   height: "100%",
  //   width: "85%",
  //   zIndex: 99,
  //   top: 0,
  //   left: 0,
  //   alignItems: "center",
  //   justifyContent: "center"
  // },

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