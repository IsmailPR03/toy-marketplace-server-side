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

   