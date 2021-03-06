const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const waterwalkRoutes = require("./api/routes/waterwalk");

mongoose.connect(
  `mongodb://${process.env.MONGO_ID}:${process.env.MONGO_PW}@ds233288.mlab.com:33288/graphql`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// const subscribe = await fetch(
//   "https://api.mailerlite.com/api/v2/groups/10941704/subscribers",
//   {
//     headers: {
//       "X-MailerLite-ApiKey": process.env.MAILERLITE_APIKEY,
//       "Content-Type": "application/json"
//     },
//     method: "POST",
//     body: JSON.stringify({
//       email: incomingEmail
//     })
//   }
// );

app.use(morgan("dev"));

//makes folders statically abailable
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-Woth, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/waterwalk", waterwalkRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
