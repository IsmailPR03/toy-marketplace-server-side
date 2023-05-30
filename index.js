const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3000
require('dotenv').config()

// midle aware
app.use(express.json())
app.use(cors())


const uri=
`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sayatpw.mongodb.net/?retryWrites=true&w=majority`;   

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    

    const toysCollection = client.db("toys").collection('toyProduct')
    const allToysCollection = client.db("toys").collection('allToys')


    app.get('/toys', async (req, res) => {
      const query = {}
      const result = await toysCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.find(query).toArray()
      res.send(result)
    })

    // my Toys section 
    app.get('/all-toys', async (req, res) => {
      const query = {}
      const result = await allToysCollection.find(query).sort({ "price": 1 }).limit(20).toArray()
      res.send(result)
    })

    app.get('/all-toys/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await allToysCollection.findOne(query)
      res.send(result)
    })


    app.get('/my-toys', async (req, res) => {
      const query = {}

      const result = await allToysCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/my-toys/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await allToysCollection.find(query).sort({ "price": 1 }).toArray()
      res.send(result)
    })
    app.get('/my-toys/search', async (req, res) => {
      const { searchTerm } = req.query;
      try {
        const toys = await allToysCollection.find({
          name: { $regex: searchTerm, $options: 'i' },
        }).toArray();
        res.json(toys);
      } catch (error) {
        res.status(500).json({ error: 'Failed to search toys' });
      }
    });



  