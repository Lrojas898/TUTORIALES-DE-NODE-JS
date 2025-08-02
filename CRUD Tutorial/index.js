import express from 'express'
import mongoose from 'mongoose'
import Product from './models/product.model.js'

const app = express()

app.use(express.json())




app.use("/api/products", productRoutes);

//req, a client petition
//res, a server response

app.get('/', (req, res) => {
  res.send('Hello World')
})

//rememebr that products are retrieved as Product is a mongoose object

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({})

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    return res.status(200).json(product)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

app.post('/api/products', async (req, res) => {
  console.log('response recieved')
  try {
    const product = await Product.create(req.body)
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

  console.log(req.body)
})

//update a product

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body)

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found!' })
    }

    const confProduct = await Product.findById(id)

    res.status(200).json(confProduct)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return res.status(404).json({ message: 'product not found' })
    }

    res.status(200).json({message: " Product has been deleted!"})



  } catch (error) {
    return res.status(404).json({ message: error.message })
  }
})

//first connect the database and then connect to your server

mongoose
  .connect(
    'mongodb+srv://admin:admin123456789@backenddb.dcvfbaw.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB'
  )
  .then(result => {
    console.log('Succesfully connected to your database')
    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
  })
  .catch(err => {
    console.log('Error when connecting to the database' + err)
  })
