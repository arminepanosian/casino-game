require("dotenv").config()
const PORT = 3003
const path = require('path');
const fs = require('fs')
const mongoose = require('mongoose');
const url = "mongodb+srv://vaheshmavonyan34:vaheshmavonyan34@cluster0.ohcj3r0.mongodb.net";
const jwt = require('jsonwebtoken');
const { BlogModel } = require('./schemes/schemes');
const bcrypt = require('bcrypt');
const { verifyToken } = require('./middleware/auth');
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(express.static('public'))
const crypto = require('crypto');
mongoose.connect(url,);
const db = mongoose.connection;
const stripe = require('stripe')('sk_test_51OZaHMSAqSidovIZL564ssqpDGen36jVeLI3vfGH3aEFhUhsJKwYtRH1VL1b6FTzgQMGua8v1uVjaI62K3IEwS1B00BvPmfZ3k');

db.on('error', () => { console.log('MongoDB connection error') });
db.once('open', () => { console.log('connected to MongoDB'); });
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const confrim = await BlogModel.findOne({ username: username })
    if (confrim) {
      return res.status(404).json({ "err": "err" })
    }
    const users = await BlogModel.find({});
    const newUser = new BlogModel({
      username, password
    });
    await newUser.save()

    res.status(200).json({ message: "Пользователь успешно зарегистрирован", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await BlogModel.findOne({ username: username, password: password });
    if (!user) {
      return res.status(400).json({ error: "invalid login or password" })
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/addproduct", async (req, res) => {
  try {
    const { username, src, name } = req.body;
    if (!username || !src || !name) {
      return;
    }
    const users = await BlogModel.findOne({ username: username });
    const addProduct = users.history
    addProduct.push({ src: src, name: name, order: false, id: Date.now().toString() })
    await users.save()


    res.status(200).json({ message: "Пользователь успешно зарегистрирован" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/getData", async (req, res) => {
  try {
    const username = req.body.username;
    if (!username) {
      return;
    }
    const user = await BlogModel.findOne({ username: username })
    res.status(200).json(user)

  } catch (err) {
    console.log(err);
  }
})

app.post("/spins", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return;
    }
    const user = await BlogModel.findOne({ username: username })
    if (!user) {
      return;
    }

    if (user.spins <= 0) {
      return res.status(400).json({ error: "error" })
    }
    user.spins--
    user.AllSpins++
    await user.save()

    res.status(200).json({ spins: user.spins })
  }
  catch (err) {
    console.log(err);
  }
})

app.post("/orderprize", async (req, res) => {
  try {
    const { id, username, email, phone } = req.body;
    console.log(id);
    console.log(username);
    console.log(email);
    console.log(phone);
    const user = await BlogModel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const foundObject = user.history.find(e => e.id === id);

    if (!foundObject) {
      return res.status(404).json({ error: "Object not found" });

    }
    foundObject.order = true;
    console.log(foundObject);
    user.markModified('history');

    await user.save()
    res.status(200).json({ success: "success" });
  }
  catch (err) {
    console.log(err);
  }


})

const storeItems = new Map([
  [1, { priceInCents: 3333, name: "1 spin" }],
  [2, { priceInCents: 6778, name: "2 spin" }],
])

app.post("/buy-ticket", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name
            },
            unit_amount: storeItem.priceInCents
          },
          quantity: item.quantity
        }
      }),
      success_url: "http://localhost:3003/",
      cancel_url: "http://localhost:3003/"
    })
    const spins = await BlogModel.findOne({ user: req.body.user })
    console.log(session);
    res.json({ url: session.url })
  }
  catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

