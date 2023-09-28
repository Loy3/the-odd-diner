const project = "the-hidden-inn";
import items  from "./listOfItems";

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