const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

// GET all products
router.get("/", (req, res, next) => {
    Product.find()
        .select("name price _id") // Select specific fields
        .exec() 
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => ({
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/products/${doc._id}`
                    }
                }))
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

// POST create product
router.post("/", (req, res, next) => {
    // Add validation
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            message: "Missing required fields: name and price"
        });
    }

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            res.status(201).json({
                message: "Product created successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/products/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

// GET single product
router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    
    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        description: "Get all products",
                        url: "http://localhost:3000/products"
                    }
                });
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

// PATCH update product
router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for (const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
    }

    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: `http://localhost:3000/products/${id}`
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

// DELETE product
router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products",
                    body: { name: "String", price: "Number" }
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;