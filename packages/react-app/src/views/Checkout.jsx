import React, { useMemo, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const useOptions = () => {
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "18px",
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    []
  );

  return options;
};

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const [intent, setIntent] = useState('');

  const paymentInit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const response = await fetch('/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 10000,
      })
    });
    const result = await response.json();

    console.log(result);
    setIntent(result.id);
  }

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    });

    console.log("[PaymentMethod]", payload);

    if (payload.paymentMethod.id) {
      const response = await fetch('/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_intent_id: intent,
          payment_method_id: payload.paymentMethod.id,
        })
      });
      const result = await response.json();

      console.log(result);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement
          options={options}
          onReady={() => {
            console.log("CardElement [ready]");
          }}
          onChange={event => {
            console.log("CardElement [change]", event);
          }}
          onBlur={() => {
            console.log("CardElement [blur]");
          }}
          onFocus={() => {
            console.log("CardElement [focus]");
          }}
        />
      </label>
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      <button onClick={paymentInit}>
        Init
      </button>
    </form>
  );
};

export default Checkout;

