const express = require('express')
const app = express()
const objectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
require('dotenv').config()


app.use(cors())
app.use(express.json())
const port = 5055;
app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4chh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err)
  const productsCollection = client.db("bdShop").collection("products");
  const ordersCollection = client.db("bdShop").collection("orders");
  console.log('connected')

  app.get('/products', (req, res) => {

    productsCollection.find()
      .toArray((err, items) => {

        res.send(items)

      })

    })
    app.get('/orders', (req, res) => {

      ordersCollection.find()
        .toArray((err, items) => {
        console.log(err)
          res.send(items)
  
        })
  
      })


    app.post('/addProducts', (req, res) => {

      const newEvent = req.body;
      console.log('adding', newEvent)
      productsCollection.insertOne(newEvent)
        .then(result => {

          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
    })
    app.delete('/delete/:id', (req, res) => {

      productsCollection.deleteOne({ _id: objectId(req.params.id) })
      
      .then(result =>{
        console.log(result)
      })

    })



    app.get('/checkout/:id', (req, res) => {


      productsCollection.find({ _id: objectId(req.params.id) })

        .toArray((err, documents) => {
          res.send(documents[0])
        })
    })
    app.post('/addOrder', (req, res) => {

      const order = req.body
    console.log(order)
      ordersCollection.insertOne(order)
        .then(result => {

          console.log(result.insertedCount)
          res.send(result.insertedCount > 0)

        })
    })


    









   
  })

  app.listen(process.env.PORT || port)
  