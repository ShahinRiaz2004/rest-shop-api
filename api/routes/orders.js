const express = require("express");
const router = express.Router();


//Handling incoming GET request to /orders
 router.get('/', (req, res, next) => {
  res.status(200).json({
    message: "Order were fetched!",
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: "Order was created!",
  });
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order Details",
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order deleted",
    orderId: req.params.orderId,
  });
});


module.exports = router;

 