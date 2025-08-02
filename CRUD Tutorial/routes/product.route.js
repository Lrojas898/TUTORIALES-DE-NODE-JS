const express = require('express');
const Product = require('./models/product.model.js');
const router = express.Router();
const ProductController = require('./controllers/product.controller.js');



router.get('/', ProductController.getProducts);
