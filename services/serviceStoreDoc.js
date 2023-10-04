const project = "the-hidden-inn";
import items from "./listOfItems";
import users from "./listOfUsers";
import AsyncStorage from '@react-native-async-storage/async-storage';


async function getUser() {
    // var token = null;
    const jsonValue = await AsyncStorage.getItem('user');

    const user = await JSON.parse(jsonValue);
    const token = user.idToken;
    // console.log("user", token);

    return token;
}
//Save Document
export const storeUserDoc = async (data) => {
    console.log("Data res", data);

    const dataToStore = {
        fields: {
            firstname: { stringValue: data.firstname },
            lastname: { stringValue: data.lastname },
            emailAddress: { stringValue: data.emailAddress },
            phoneNum: { stringValue: data.phoneNum },
            imageName: { stringValue: data.imageName },
            imageUrl: { stringValue: data.imageUrl },
            address: {
                mapValue: {
                    fields: {
                        streetAddr: { stringValue: data.streetAddr },
                        city: { stringValue: data.city },
                        zipCode: { stringValue: data.zipCode }
                    }
                }
            },
            cardDetails: {
                mapValue: {
                    fields: {
                        cardName: { stringValue: data.cardName },
                        cardNum: { stringValue: data.cardNum },
                        zipCode: { stringValue: data.zipCode },
                        cardDate: { stringValue: data.cardDate }
                    }
                }
            },
            userId: { stringValue: data.userId }
        }
    }

    // console.log("Json", JSON.stringify(dataToUpdate));
    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/oddUsers`;
    try {
        console.log("Data to store", dataToStore.fields.cardDetails.mapValue);
        await fetch(url, {
            method: "POST",
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify(dataToStore),
        }).then(() => {
            console.log("Done");
        }).catch((error) => {
            console.log(error);
        })
        // const dataRes = await response.json();

        // return dataRes;
    } catch (error) {
        console.log(error);
    }
}


//Get Recordings
/*export const getItems = async () => {
    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/oddItems`;
    try {
        const response = await fetch(url, {
            method: "GET",
        });
        const data = await response.json();
        // console.log("Done: ", data.documents[0].name);
        let items = [];

        data.documents.forEach(dat => {
            // console.log("Done: ", dat.fields.email.stringValue);

            const array = dat.name.split("/");
            items.push({ id: array[array.length - 1], ...dat.fields })
            // console.log("Id: ", array[array.length - 1]);


        });
        console.log("Journals", items);
        return items;
    } catch (error) {
        console.log(error);
    }
}
*/

export const getItems = async () => {
    // console.log("items", items.documents[0].fields);

    let myItems = [];
    const data = items;
    // console.log("data",data);
    data.documents.forEach(dat => {
        // console.log("Done: ", dat.fields.email.stringValue);

        const array = dat.name.split("/");
        myItems.push({ id: array[array.length - 1], ...dat.fields })
        // console.log("Id: ", array[array.length - 1]);


    });
    // console.log("Journals", myItems);
    return myItems;
}


// Get Users
export const getUsers = async (id) => {
    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/oddUsers`;
    try {
        const response = await fetch(url, {
            method: "GET",
        });
        const data = await response.json();
        // console.log("Done: ", data.documents[0].name);
        let user = [];

        data.documents.forEach(dat => {
            // console.log("Done: ", dat.fields.email.stringValue);
            if (id === dat.fields.userId.stringValue) {
                const array = dat.name.split("/");
                user.push({ id: array[array.length - 1], ...dat.fields })
                // console.log("Id: ", array[array.length - 1]);
            }
        });
        // console.log("My user", user);
        return user;
    } catch (error) {
        console.log(error);
    }
}

// export const getUsers = async (id) => {
//     // console.log("items", items.documents[0].fields);

//     let myUsers = [];
//     const data = users;
//     // console.log("data",data);
//     let user = [];
//     data.documents.forEach(dat => {
//         // console.log("Done: ", dat.fields.email.stringValue);
//         if (id === dat.fields.userId.stringValue) {
//             const array = dat.name.split("/");
//             user.push({ id: array[array.length - 1], ...dat.fields })
//             // console.log("Id: ", array[array.length - 1]);
//         }
//     });
//     // console.log("My user", user);
//     return user;
// }


export const updateUserAddress = async (data) => {


    const user = {
        fields: {
            address: {
                mapValue: {
                    fields: {
                        streetAddr: {
                            stringValue: data.streetAddr
                        },
                        city: {
                            stringValue: data.city
                        },
                        zipCode: {
                            stringValue: data.zipCode
                        }
                    }
                }
            }
        }
    }

    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/oddUsers/${data.id}?currentDocument.exists=true&updateMask.fieldPaths=address&alt=json`;
    try {
        await fetch(url, {
            method: "PATCH",
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify(user),
        }).then(() => {
            console.log("Done");
        }).catch((error) => {
            console.log(error);
        })
        // const data = await response.json();

        // return data;
    } catch (error) {
        console.log(error);
    }
}


export const updateUserCardDetails = async (data) => {


    const user = {
        fields: {
            cardDetails: {
                mapValue: {
                    fields: {
                        cardName: { stringValue: data.cardName },
                        cardNum: { stringValue: data.cardNum },
                        zipCode: { stringValue: data.zipCode },
                        cardDate: { stringValue: data.cardDate }
                    }
                }
            }
        }
    }

    // console.log(data);

    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/oddUsers/${data.id}?currentDocument.exists=true&updateMask.fieldPaths=cardDetails&alt=json`;
    try {
        await fetch(url, {
            method: "PATCH",
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify(user),
        }).then(() => {
            console.log("Done");
        }).catch((error) => {
            console.log(error);
        })
        // const data = await response.json();

        // return data;
    } catch (error) {
        console.log(error);
    }
}


//Save item
export const storeOrders = async (data) => {
    console.log("Data res", data.items.numOfItems);
    const token = await getUser()
    // const dataToStore = {
    //     fields: {
    //         useID: { stringValue: data.useID },
    //         itemID: {
    //             stringValue: data.itemID
    //         },
    //         numOfItems: {
    //             stringValue: data.numOfItems
    //         },
    //         totalPrice: {
    //             stringValue: data.totalPrice
    //         },
    //         orderStatus: {
    //             stringValue: "Placed"
    //         }
    //     }
    // }


    const dataToStore = {
        fields: {
            // Map each object in the array to a document in Firestore
            useID: { stringValue: data.useID },
            items: {
                arrayValue: {
                    values: data.items.map((dat) => ({
                        mapValue: {
                            fields: {
                                itemID: { stringValue: dat.itemID },
                                numOfItems: { stringValue: dat.numOfItems },
                                totalPrice: { stringValue: dat.totalPrice },
                                orderStatus: { stringValue: "Placed" }
                            },
                        },
                    })),
                }
            }
        }
    }


    console.log("Json", dataToStore.fields.items.arrayValue.values[0].mapValue.fields);
    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/oddOrders`;
    try {
        // console.log("Data to store", dataToStore.fields);
        await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Firebase ${token}`,
                'ContentType': 'application/json'
            },
            body: JSON.stringify(dataToStore),
        }).then(() => {
            console.log("Done");
        }).catch((error) => {
            console.log(error);
        })
        // const dataRes = await response.json();

        // return dataRes;
    } catch (error) {
        console.log(error);
    }
}