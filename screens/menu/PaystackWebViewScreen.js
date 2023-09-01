import React from 'react';
import { View } from 'react-native';
import PaystackWebView from 'react-native-paystack-webview';

const PaystackWebViewScreen = ({ route }) => {
  const { amountInKobo, reference } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <PaystackWebView
        buttonText="Pay Now"
        paystackKey="pk_live_f78da8895c8389a2bd217a941ae9b7b867e50d14"
        amount={amountInKobo.toString()}
        reference={reference}
        currency="NGN"
        onPaystackSuccess={(response) => {
          // Handle success, e.g., show success message to user
          console.log('Payment Successful', response);
        }}
        onPaystackFailure={(error) => {
          // Handle failure, e.g., show error message to user
          console.log('Payment Failed', error);
        }}
      />
    </View>
  );
};

export default PaystackWebViewScreen;
