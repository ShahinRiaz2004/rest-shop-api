const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/order");
const Product = require("../models/product");


//Get All Orders

router.get("/", (req, res, next) => {

  Order.find()
    .select("product quantity _id")
    .populate("product", "name ")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        order: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "https://localhost:3000/orders/" + doc._id
            }
          }
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    }
    )
})


//Create A Order
router.post("/", (req, res, next) => {
  // Validate input
 
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });

      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored successfully",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Error creating order", error: err.message });
    });
});

//Get A Order
router.get("/:orderId", (req, res, next) => {
   
   Order.findById(req.params.orderId) 
   .populate("product")
   .exec()
   .then(order => {
      res.status(200).json({
         order: order,
         request: {
          type: "GET",
          url: "http://localhost:3000/orders"
         }
      })
   })
   .catch(err => {
        res.status(500).json({
          error : err
        })
   });

 
})

//Update A Order
router.patch("/:orderId", (req, res, next) => {
  
  Order.findById(req.params.orderId);
  const {product, quantity} = req.bo
  
  res.status(200).json({
    message: "Order upated by Id"

  })
})

// DELETE order by ID
router.delete("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  
  Order.findByIdAndDelete(orderId)
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;