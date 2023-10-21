import asyncHandler from "express-async-handler";
import Product from "../models/Products.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category } = req.body;

    const product = new Product({
        name,
        description,
        price,
        category,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.description = description;
        product.price = price;
        product.category = category;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
        res.json({ message: "Product removed" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

export default {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
