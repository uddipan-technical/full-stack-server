
const express = require('express')
//const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
//  app.use(bodyParser.json());
//  app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.urlencoded({ extended: false}))
app.use(express.json())
const port = 5012;

app.get('/', (req, res) => {
 res.send("hello from db it's working")
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fhsev.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);
console.log(process.env.DB_Name);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 console.log(err)
 const productCollection = client.db("full-stack-server").collection("products");
 const ordersCollection = client.db("full-stack-server").collection("orders");
 console.log('Database connected');

app.post('/addProduct', (req, res) => {
   const products = req.body;
   console.log(req.body)
   productCollection.insertOne(products)
   .then(result => {
    // console.log(result.insertedCount);
     res.send(result.insertedCount)
     
   })
})


app.get('/products', (req, res) => {
  productCollection.find({})
  .toArray((err, documents) => {
    res.send(documents);
  })
})

app.get('/product/:key', (req, res) => {
 productCollection.find({key: req.params.key})
 .toArray((err, documents) => {
   res.send(documents[0]);
 })
})

app.post('/productsByKeys', (req, res) => {
 const productKeys = req.body;
 productCollection.find({key: {$in: productKeys}})
 .toArray( (err, documents) => {
   res.send(documents)
 })
})


app.post('/addOrder', (req, res) => {
 const order = req.body;
 ordersCollection.insertOne(order)
 .then(result => {
   console.log(result.insertedCount);
   res.send(result.insertedCount > 0)
   
 })
})

app.delete('/deleteProduct', (req, res) => {
 const key = req.body.name
 console.log(key);
 productCollection.findOneAndDelete({key: key}).then(result => {
   //console.log(result)
 })
})







});



app.listen(process.env.PORT || port)
//https://meet.google.com/wup-dhce-pku