import React, { useMemo, useState, useEffect } from "react";
import { utils } from "ethers";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Spin, Result, Steps, Button, Form, InputNumber, message } from 'antd';
import { parseUnits } from "@ethersproject/units";
import TokenBalances from "./TokenBalances";

const { Step } = Steps;

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

const steps = [
  {
    title: 'Réserver',
    content: 'Réserver vos jetons',
  },
  {
    title: 'Signer',
    content: 'Signer avec votre wallet',
  },
  {
    title: 'Payer',
    content: 'Payer avec votre CB',
  },
  {
    title: 'Récupérer',
    content: 'Récupérer vos jetons',
  },
];

const Checkout = ({ provider, address, tx, writeContracts, readContracts }) => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const price = 10;
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [intent, setIntent] = useState('');
  const [amount, setAmount] = useState('');
  const [signature, setSignature] = useState('');

  useEffect(() => {
    function listentForEvent() {
      if (readContracts)
        readContracts.ERC1400.on('ReleasePaidTokens', async (addr, intent) => {
          message.success('Bonne nouvelle ! Vos jetons sont déjà disponible !')
        });
    }

    listentForEvent();
  }, []);

  const paymentInit = async () => {
    setLoading(true);
    console.log(parseUnits(`${amount}`).toString());
    if (!stripe || !elements) {
      return;
    }
    const response = await fetch('https://dvp-server.barakov.xyz/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(amount) * price * 100,
        addr: address
      })
    });
    const result = await response.json();

    console.log(result);
    setIntent(result.id);
    setLoading(false);
    setCurrent(1);
  }

  const sign = async () => {
    setLoading(true);
    const signer = provider.getSigner();

    const message = utils.solidityKeccak256(
      ["address", "uint256", "string"],
      [address, parseUnits(`${amount}`), intent]
    );
    const messageBytes = utils.arrayify(message);
    const sig = await signer.signMessage(messageBytes)
    console.log(sig);
    setSignature(sig);
    setLoading(false);
    setCurrent(2);
  }

  const pay = async () => {
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    });

    console.log("[PaymentMethod]", payload);

    if (payload.paymentMethod.id) {
      const response = await fetch('https://dvp-server.barakov.xyz/pay', {
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
    setLoading(false);
    setCurrent(3);
  };

  const claim = async () => {
    setLoading(true);
    const res = await tx(
      writeContracts
      .ERC1400
      .reserveAndVerifyPayment(
        parseUnits(`${amount}`),
        intent,
        signature
      ));
    console.log(res);
    setLoading(false);
    setCurrent(4);
  }

  return (
    <div>
      <TokenBalances readContracts={readContracts} address={address} />
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{current !== 4 ? (
        <Spin spinning={loading}>
          <h2 style={{ margin: "100px 0 30px" }}>{steps[current].content}</h2>
          {current === 0 ? (
            <>
              <h4>Prix par unité : {price} EUR</h4>
              <Form
                layout="inline"
                name="intent"
                onFinish={paymentInit}
                style={{ paddingTop: '50px', justifyContent: 'center' }} 
              >
                <Form.Item
                  label="Quantité de jetons"
                  name="amount"
                  rules={[{ required: true, message: 'Valeur requise!' }]}
                >
                  <InputNumber min={1} stringMode={true} onChange={(value) => setAmount(value)}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Réserver
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : ""}
          {current === 1 ? (
            <Button onClick={sign}>
              Signer
            </Button>
          ) : ""}
          {current === 2 ? (
            <>
              <h4>Somme à payer : {price * Number(amount)} EUR</h4>
              <Form
                layout="horizontal"
                name="payment"
                onFinish={pay}
                style={{ paddingTop: '50px', justifyContent: 'center' }} 
              >
                <Form.Item>
                  <CardElement options={options} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" disabled={!stripe} htmlType="submit">
                    Payer
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : ""}
          {current === 3 ? (
            <Button onClick={claim}>
              Récupérer
            </Button>
          ) : ""}
        </Spin>
      ) : (
        <Result
          status="success"
          title="Merci pour votre investissement !"
          subTitle="La transaction a été envoyée. Vos jetons seront bientôt disponible !"
        />
      )}
      </div>
    </div>
  );
};

export default Checkout;
