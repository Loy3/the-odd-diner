import { StripeProvider } from '@stripe/stripe-react-native';
import { setOptions } from '@stripe/stripe-react-native';
import stripe from 'react-native-stripe-payment';


stripe.setOptions({
  publishableKey: 'pk_test_51NxPV0IvSlofnRIzU39U6CycGJAN6zbTVpk0iFghsLbIN9vFHrQOXNYq8WT2xqxQGkHTAWpnlaw6AKJ7F1XnI0Pu00aGV33DVU',
});

// const cardDetails = {
//   number: '4242424242424242',
//   expMonth: 12,
//   expYear: 2023,
//   cvc: '123',
// };

export const makePayment = (details) => {
  stripe.createTokenWithCard(details)
    .then((token) => {
      // Use the token for testing purposes
      console.log(token);
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });
}
