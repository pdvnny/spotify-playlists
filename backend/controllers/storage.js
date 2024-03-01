// controllers/storage.js

// Where I can establish a connection to the database and write methods
// for handling data that should be fetched and/or sent to the database


// Boilerplate code from MongoDB
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pdunn91:kb2uu9z0hBluJvhf@volo-play-dev.hsbm6cs.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


// // test
// async function run() {
//     try {
//       // Connect the client to the server	(optional starting in v4.7)
//       await client.connect();
//       // Send a ping to confirm a successful connection
//       await client.db("admin").command({ ping: 1 });
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }

// run().catch(console.dir);


// Connect to database using mongoose
const mongoose = require('mongoose');
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB Database');
    })
    .catch((err) => {
        console.log("Connection failed!");
    });


