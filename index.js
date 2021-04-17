const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome To SB Technologies Server!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uohe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err)

    const serviceCollection = client.db("sbTechnologies").collection("services");
    const reviewCollection = client.db("sbTechnologies").collection("reviews");
    const adminCollection = client.db("sbTechnologies").collection("adminPanel");

    // store service information and image to server
    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new service: ', newService)
        serviceCollection.insertOne(newService)
            .then(result => {
                // console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // display service information in client side
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                res.send(items)
                // console.log('from database', items)
            })
    })

    // store review information and image to server
    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('adding new review: ', newReview)
        reviewCollection.insertOne(newReview)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // display review information in client side
    app.get('/reviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    // store admin information to server
    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('adding new admin: ', newAdmin)
        adminCollection.insertOne(newAdmin)
            .then(result => {
                // console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})