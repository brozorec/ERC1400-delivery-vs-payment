require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_KEY);
const express = require('express');
const app = express();
app.use(express.static('.'));
app.use(express.json());

app.post('/create-intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'eur',
    payment_method_types: ['card'],
    transfer_group: '{ORDER10}',
    confirmation_method: 'manual',
    capture_method: 'manual',
  });
  console.log(paymentIntent);

  res.json({ id: paymentIntent.id });
});

//https://stripe.com/docs/payments/capture-later
//https://stripe.com/docs/connect/charges-transfers
//https://stripe.com/docs/api/payment_intents?lang=node

app.post('/pay', async (req, res) => {
  try {
    // Confirm the PaymentIntent
    const intent = await stripe.paymentIntents.confirm(
      req.body.payment_intent_id,
      {
        payment_method: req.body.payment_method_id,
      }
    );
    res.json({ id: intent.id });
  } catch (e) {
    return res.send({ error: e.message });
  }
});

app.get('/check', async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.retrieve(
      req.query.payment_intent_id
    );
    console.log(intent);
    res.json({ SUCCESS: intent.status === 'requires_capture' });
  } catch (e) {
    return res.send({ SUCCESS: false, error: e.message });
  }
});

app.get('/capture', async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.capture(
      req.query.payment_intent_id
    );
    console.log(intent);
    res.send(true);
  } catch (e) {
    return res.send({ error: e.message });
  }
});

app.get('/release', async (req, res) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: 1000,
      currency: 'eur',
      destination: 'acct_1Ieke8RglQ4Yr66h',
      transfer_group: '{ORDER10}',
    });
    console.log(transfer);
    res.send(true);
  } catch (e) {
    return res.send({ error: e.message });
  }
});

app.listen(4242, () => console.log('Running on port 4242'));
