import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput, ScrollView } from 'react-native';

import { getItems, getUsers } from "../services/serviceStoreDoc";
import menuIcon from "../assets/Icons/menu.png";

import allIcon from "../assets/Icons/table2.png";
import bfIcon from "../assets/Icons/breakfast.png";
import bevIcon from "../assets/Icons/bev.png";
import lnIcon from "../assets/Icons/lunch.png";
import dinIcon from "../assets/Icons/dinner.png";

import userIcon from "../assets/Icons/user2.png";
import addIcon from "../assets/Icons/add.png";
import subIcon from "../assets/Icons/minus.png";
import subImg from "../assets/Images/1.jpg";
import popularBtnLeft from "../assets/Icons/prev.png";
import popularBtnRight from "../assets/Icons/next.png";
import prepTimeIcon from "../assets/Icons/stopwatch2.png";
import priceIcon from "../assets/Icons/money.png";
import starIcon from "../assets/Icons/star.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideNavComp from './SideNavComp';

const HomeScreen = ({ navigation }) => {
  const [loadingStatus, setloadingStatusStatus] = useState(false);
  const [items, setItems] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [addBtnStatus, setAddBtnStatus] = useState(true);
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

  const [menuStatus, setMenuStatus] = useState(false);

  const [addBStatus, setAddBStatus] = useState(false);

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
          id: popular[1].id,
          itemImageUrl: popular[1].itemImageUrl,
          itemName: popular[1].itemName,
          itemSub: popular[1].itemSub,
          itemPrepTime: popular[1].itemPrepTime,
          itemPrice: popular[1].itemPrice,
        });
        setloadingStatusStatus(false)
      })
    })();

  }, [])

  async function getUser() {
    const jsonValue = await AsyncStorage.getItem('user');
    const res = jsonValue != null ? JSON.parse(jsonValue) : null;

    const user = await getUsers(res.localId)
    // console.log("Ress", res);
    // console.log("signed in user", user[0].lastname.stringValue);
    setSignedInUser({
      firstname: user[0].firstname.stringValue,
      lastname: user[0].lastname.stringValue,
      imageUrl: user[0].imageUrl.stringValue,
      emailAddress: res.email,
      userID: res.localId
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

  function openMenu() {
    setMenuStatus(true);
  }

  async function viewItem(id) {
    // console.log(id);
    const itemId = {
      id: id
    }
    const jsonValue = JSON.stringify(itemId);
    await AsyncStorage.setItem('itemId', jsonValue).then(() => {
      console.log("Success");
      navigation.navigate("Item")
    })
  }

  async function addToCart(id) {
    const res = await checkCart(id);
    // console.log(res);
    console.log("itemId",id);
    if (res === true) {
      console.log("Item already added");
      // const jsonValue = await AsyncStorage.getItem('cartItems');
      // const result = jsonValue != null ? JSON.parse(jsonValue) : null;

      // console.log("res", result);
      // var index = 0;
      // var arrToAdd = [];
      // for (let r = 0; r < result.length; r++) {
      //   if (result[r].id === id) {
      //     console.log("Item alreeee added");
      //     index = r;
      //   } else {
      //     arrToAdd.push(result[r]);
      //   }

      // };
      // const jsonToSetValue = JSON.stringify(arrToAdd);
      // await AsyncStorage.setItem('cartItems', jsonToSetValue).then(() => {
      //   console.log("Success");
      // })

    } else {
      console.log("Item not added");

      const jsonValue = await AsyncStorage.getItem('cartItems');
      const result = jsonValue != null ? JSON.parse(jsonValue) : null;
      // await AsyncStorage.removeItem('cartItems')

      // console.log("res", res);
      var itemsToCart = [];
      var itemId = {
        id: id,
        userID: signedInUser.userID
      }

   
      // console.log(itemId);
      if (result === null) {
        itemsToCart.push(itemId);
        const jsonSetValue = JSON.stringify(itemsToCart);
        await AsyncStorage.setItem('cartItems', jsonSetValue).then(() => {
          console.log("Success");
        })
      } else {
        result.forEach(r => {
          itemsToCart.push(r);
        });
        itemsToCart.push(itemId);
        const jsonSetValue = JSON.stringify(itemsToCart);
        await AsyncStorage.setItem('cartItems', jsonSetValue).then(() => {
          console.log("Success");
        })
      }
    }
  }

  async function checkCart(id) {
    const jsonValue = await AsyncStorage.getItem('cartItems');
    const res = jsonValue != null ? JSON.parse(jsonValue) : null;
    // console.log(res);
    const curItem = id;
    // console.log(curItem);
    var status = false;
    if (res !== null) {
      res.forEach(r => {
        if (r.id === curItem && r.userID === signedInUser.userID) {
          console.log("found");
          status = true;
        } else {
          console.log("not found");
        }
      });
    }

    return status;

  }


  function navigateToProfile(){
    navigation.navigate("ViewProfile");
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
          {/* <View style={{
          position:"fixed", 
        top:0,
        width:"100%",
        height:35,
        backgroundColor: '#FFFEF5',
        zIndex:99
      }}/> */}
          <View style={styles.header}>
            <View style={styles.menuCont}>
              <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
                <Image source={menuIcon} style={styles.menu} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTextCont}>
              <Text style={styles.headerDate}>{formattedDate}</Text>
              <Text style={styles.headerUser}>{`Hello! ${signedInUser.firstname === null ? "First Name" : signedInUser.firstname} ${signedInUser.lastname === null ? "Last Name" : signedInUser.lastname}`}</Text>
            </View>
            <TouchableOpacity style={styles.headerImageCont} onPress={navigateToProfile}>
              <Image source={signedInUser.imageUrl === null ? userIcon : { uri: signedInUser.imageUrl }} style={styles.headerImage} />
            </TouchableOpacity>

            <View style={styles.popularCont}>

              <Image source={popularItems.itemImageUrl === "" ? subImg : { uri: popularItems.itemImageUrl }} style={styles.popularImg} />
              {/* </TouchableOpacity> */}
              <View style={styles.popularBg} />

              <TouchableOpacity style={styles.popularBtnLeftCont} onPress={() => prevPopular(popularItems.itemName)} >
                <Image source={popularBtnLeft} style={styles.popularBtnLeft} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.popularBtnRightCont} onPress={() => nextPopular(popularItems.itemName)}>
                <Image source={popularBtnRight} style={styles.popularBtnRight} />
              </TouchableOpacity>

              <View style={styles.popularDetailsCont}>

                {/* <Image source={starIcon} style={styles.starIcon} /> */}
                <TouchableOpacity onPress={() => viewItem(popularItems.id)} style={{ width: 70, height: 45, position: "absolute", top: 15, right: "5%", zIndex: 99, borderWidth: 3, borderColor: "#7C9070", borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: "#7C9070", fontWeight: "bold" }}>View</Text>
                </TouchableOpacity>

                <Text style={styles.popularDetailsTitle}>{popularItems.itemName}</Text>
                <Text style={styles.popularDetailsSub}>{popularItems.itemSub}</Text>
                <View style={styles.line} />

                <View style={{ marginHorizontal: 10, flexDirection: "row", width: "95%" }}>

                  <View style={styles.mostPopCont}>
                    <Text style={[styles.mostPop, { marginLeft: 15 }]}>Most</Text>
                    <Text style={[styles.mostPop, { marginLeft: 10 }]}>Popular</Text>
                  </View>

                  <View style={styles.prepTimeCont}>
                    <Image source={prepTimeIcon} style={styles.prepTimeIc} />
                    <Text style={styles.prepTimeText}>{popularItems.itemPrepTime}</Text>
                  </View>

                  <View style={styles.priceCont}>
                    <Image source={priceIcon} style={styles.prepTimeIc2} />
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
                <Image source={allIcon} style={styles.filterBtnImg} />
              </TouchableOpacity>
              <Text style={styles.filterBtnTxt}>All</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => filterItems("bev")}>
                <Image source={bevIcon} style={styles.filterBtnImg} />
              </TouchableOpacity>
              <Text style={styles.filterBtnTxt}>Beverages</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => filterItems("breakfast")}>
                <Image source={bfIcon} style={styles.filterBtnImg} />
              </TouchableOpacity>
              <Text style={styles.filterBtnTxt}>Breakfast</Text>
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
                    <TouchableOpacity onPress={() => viewItem(item.id)}>
                      <Image source={item.itemImageUrl.stringValue ? { uri: item.itemImageUrl.stringValue } : subImg} style={styles.itemImg} />
                    </TouchableOpacity>
                    <View style={styles.cardPriceCont}>
                      <Text style={styles.cardPrice}>{item.itemPrice.stringValue ? `R${item.itemPrice.stringValue}.00` : "R00.00"}</Text>
                    </View>
                    <Text style={styles.cardItem}>{item.itemName.stringValue ? `${item.itemName.stringValue}` : "Title"}</Text>

                    <View style={styles.cardPrepTimeCont}>
                      <Image source={prepTimeIcon} style={styles.cardPrepTimeIc} />
                      <Text style={styles.cardPrepTimeText}>{item.itemPrepTime.stringValue ? `${item.itemPrepTime.stringValue}` : "10 - 15min"}</Text>
                    </View>

                    {/* {!checkCart(item.id) ? */}
                      <TouchableOpacity style={styles.addToCart} onPress={() => addToCart(item.id)}>
                        <Image source={addIcon} style={styles.addToCartImg} />
                      </TouchableOpacity>
                      {/* : 
                       <TouchableOpacity style={styles.addToCart} onPress={() => addToCart(item.id)}>
                        <Image source={subIcon} style={styles.addToCartImg} />
                      </TouchableOpacity> */}
                    {/* } */}
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

      {menuStatus ?
        <SideNavComp setMenuStatus={setMenuStatus} />
        : null}
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  line: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#7C9070",
    marginHorizontal: "4%",
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
    objectFit: "cover",
    borderRadius: 30
  },
  popularBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "gray",
    zIndex: 10,
    opacity: 0.05,
    borderRadius: 30
  },

  popularBtnLeftCont: {
    position: "absolute",
    top: "37%",
    left: -13,
    backgroundColor: "#FFFEF5",
    height: 50,
    width: 50,
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
    top: "37%",
    right: -13,
    backgroundColor: "#FFFEF5",
    height: 50,
    width: 50,
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
    bottom: "3%",
    left: 0,
    marginHorizontal: "3%",
    backgroundColor: "#FFFEF5",
    height: 150,
    width: "94%",
    zIndex: 30,
    borderRadius: 30
    // alignItems:"center",
    // justifyContent:"center"
  },
  starIcon: {
    width: 25,
    height: 25,
    position: "absolute",
    top: 15,
    right: 15
  },
  popularDetailsTitle: {
    fontSize: 24,
    color: "#7C9070",
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 15
  },
  popularDetailsSub: {
    fontSize: 15,
    color: "#A8C099",
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 1
  },

  mostPopCont: {
    width: "30%",
    justifyContent: "center",
    marginTop: -6
  },
  mostPop: {
    color: "#A8C099",
    fontSize: 14,
    fontWeight: "bold",

  },
  prepTimeCont: {
    width: "40%",
    // backgroundColor:"yellow",
    flexDirection: "row",
    alignItems: "center",

  },
  prepTimeIc: {
    width: 25,
    height: 25,
    marginLeft: -5
  },
  prepTimeIc2: {
    width: 25,
    height: 25,
    marginLeft: -5,
    marginRight: 7
  },
  prepTimeText: {
    marginLeft: 2,
    color: "#7C9070",
    fontSize: 15,
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
    height: 13,
    width: 13,
    backgroundColor: "#E0E0E0",
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
    width: 65,
    height: 65,
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
    width: 35,
    height: 35
  },
  filterBtnTxt: {
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#7C9070",
    fontSize: 12
    // backgroundColor:"yellow"
  },
  itemTitle: {
    marginVertical: 10,
    marginHorizontal: 20,
    color: "#7C9070",
    fontWeight: "bold",
    fontSize: 18
  },
  itemsCont: {
    marginVertical: 10,
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
    backgroundColor: "#F5F6F3",
    marginVertical: 10,
    marginHorizontal: "1%",
    borderRadius: 20
  },
  itemImg: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },

  cardPriceCont: {
    backgroundColor: "#FFFEF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    // width: "60%",
    position: "absolute",
    top: 158,
    left: 7,
    borderRadius: 10
  },
  cardPrice: {
    fontSize: 16,
    color: "#7C9070",
    fontWeight: "bold"
  },
  cardItem: {
    marginVertical: 10,
    marginHorizontal: 10,
    color: "#7C9070",
    fontWeight: "bold",
    fontSize: 17
  },
  cardPrepTimeCont: {
    marginTop: 0,
    marginLeft: 5,
    width: "50%",
    // backgroundColor:"yellow",
    flexDirection: "row",
    alignItems: "center",
  },
  cardPrepTimeIc: {
    width: 23,
    height: 23,
    marginLeft: 5,
    marginBottom: 10
  },
  cardPrepTimeText: {
    marginLeft: 2,
    marginBottom: 10,
    color: "#7C9070",
    fontSize: 15,
    fontWeight: "700",
  },
  addToCart: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    backgroundColor: "#7C9070",
    justifyContent: "center",
    alignItems: "center",
    borderRadius:50
  },
  addToCartImg: {
    width: 20,
    height: 20
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