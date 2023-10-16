
export const makePayment = async (amount) => {

    console.log("amount", amount);
   
    const url = "http://localhost:3000/payments/intents"
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify(amount),
        });
        const data = await response.json();
        console.log("Done: ", data);

        return data;
    } catch (error) {
        console.log(error);
    }
}
