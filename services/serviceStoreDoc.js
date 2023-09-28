const project = "the-hidden-inn";

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