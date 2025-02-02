const express = require("express");

const router = express.Router();


  router.get("/", (req, res , next) => {
 
    res.status(200).json({
        message: "Order were fetched "
    })
  })

  router.post("/", (req, res, next) => {
    console.log("Received body:", req.body);  // Debugging line

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            console.log("Product saved:", result);
            res.status(201).json({
                message: "Product created successfully",
                createdProduct: result
            });
        })
        .catch(err => {
            console.error("Error saving product:", err);
            res.status(500).json({ error: err });
        });
});


router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message:"Order were fetched",
    orderId:req.params.orderId,
  })
})

router.patch("/:orderId", (req, res, next) => {
    res.status(200).json({
     message: "Order upated by Id"

    })
})


router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message:"Order deleted by id"
  })

})

module.exports = router;