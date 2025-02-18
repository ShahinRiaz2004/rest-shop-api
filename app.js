const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const mongoose  = require("mongoose")

const productsRoutes = require("./api/routes/products")
const ordersRoutes = require("./api/routes/orders");
 const userRoutes = require("./api/routes/user");


app.use(morgan("dev"))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())


// Add after bodyParser middleware in app.js
mongoose.connect("mongodb://localhost:27017/your-db-name")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

mongoose.Promise = global.Promise;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, GET, POST, PATCH, DELETE");
      return res.status(200).json({});
  }
  next();
});

// Now add routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use("/user", userRoutes);
    

  app.use((req, res, next) => {

      const error = new Error("No found");
      error.status =404  ;
      next(error)
  })


  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    })
  })

 module.exports = app;
 