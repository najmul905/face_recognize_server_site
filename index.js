const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const stripe=require('stripe')(process.env.payment_secret_key)

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello Face recognize')
})
 
app.post("/create_payment_intent", async (req, res) => { // Fix the endpoint name
    try {
      const { price } = req.body; // Make sure to use the correct key 'price'
      if (!price) {
        return res.status(400).send({ error: "Price is required" });
      }
  
      const amount = price * 100; // Convert price to cents
      const paymentIntent = await stripe.paymentIntents.create({ // Fix the method name
        amount: amount,
        currency: 'usd',
        payment_method_types: ["card"]
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
    console.log(`Face recognize is running on ${port}`)
})