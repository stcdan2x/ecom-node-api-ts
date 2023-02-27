import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '@/models/productModel.js';

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find({});
    res.send(products);
  }
);

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  res.send(product);
});

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, category, brand, image } = req.body;

    const product = new Product({
      name,
      description,
      category,
      brand,
      image,
    });

    const createdProduct = await product.save();

    if (createdProduct) {
      res
        .status(201)
        .send({ message: 'Product Created', product: createdProduct });
    } else {
      res.status(500).send({ message: 'Error in creating product' });
    }
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.image = req.body.image || product.image;
      product.brand = req.body.brand || product.brand;
      product.category = req.body.category || product.category;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.description = req.body.description || product.description;

      const updatedProduct = await product.save();

      if (updatedProduct) {
        res.send({ message: 'Product Updated', product: updatedProduct });
      } else {
        res.status(500).send({ message: 'Error in updaing product' });
      }
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      const deletedProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deletedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }
);
