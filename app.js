const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const crypto = require("crypto");

const Email = require("./utils/Email");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

const users = require("./data/users.json");
const promos = require("./data/promo.json");
const notifications = require("./data/notifications.json");

// fetch users
const fetchUsers = async (users, cb) => {
  // code
  await fs.readFile(users, (err, userData) => {
    if (err) {
      return cb && cb(err);
    }

    try {
      const obj = JSON.parse(userData);
      return cb && cb(null, obj);
    } catch (err) {
      return cb && cb(err);
    }
  });
};

// generate promo code
const generatePromoCode = (promoCode) => {
  // code
  promoCode = "";

  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * alphabets.length);
    promoCode += alphabets[randomIndex];
  }

  return promoCode;
};

// send notifications
const sendNotifications = async (notificationType, subject, body, target) => {
  const code = "";
  generatePromoCode(code);

  await new Email(target, code);

  // code
  console.log(`The type of notification is ${notificationType}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log(`Sending notification to user ${target}`);
  console.log(`Code: ${code}`);
};

app.get("/api/users", (req, res) => {
  fetchUsers("./data/users.json", (err, user) => {
    if (err) {
      console.log(err);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Retrieved all users' data successfully",
      data: user,
    });
  });
});

// create promotion
app.post("/api/promos", (req, res) => {
  const { name, amount } = req.body;

  const startDate = new Date(Date.now());
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  let arr = [];
  arr.push({ name, startDate, endDate, amount });
  let json = JSON.stringify(arr);

  fs.writeFile("./data/promo.json", json, "utf8", function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(promos));
    console.log(`Writing to promos.json`);
  });

  res.status(201).json({
    success: true,
    message: "Created a promotion",
    data: {
      name: name,
      startDate: startDate,
      endDate: endDate,
      amount: amount,
    },
  });
});

app.post("/api/notifications", (req, res) => {
  // code
  const { notificationType, subject, body, target } = req.body;

  sendNotifications(notificationType, subject, body, target);

  let arr = [];
  arr.push({ notificationType, subject, body, target });
  let json = JSON.stringify(arr);

  fs.writeFile(
    "./data/notifications.json",
    json,
    "utf8",
    function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(notifications));
      console.log(`Writing to notifications.json`);
    }
  );

  res.status(201).json({
    success: true,
    message: "Sent a notification to target user",
    data: {
      notificationType: notificationType,
      subject: subject,
      body: body,
      target: target,
    },
  });
});

app.listen(5000, () => {
  console.log("The server is listening on port 5000...");
});
