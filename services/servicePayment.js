
export const makePayment = async (amount) => {

    console.log("amount", amount);
    // const 
    const url = "https://the-odd-diner-be.onrender.com/payments/intents"
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount
            }),
        });
        const data = await response.json();
        // console.log("Done: ", data); 

        return data;
    } catch (error) {
        console.log(error);
    }
}
