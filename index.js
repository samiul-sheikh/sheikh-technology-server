const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
    const orderCollection = client.db("sbTechnologies").collection("serviceOrder");

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

    // display order services from server in serviceOrder
    app.get('/service/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        serviceCollection.find({ _id: id })
            .toArray((err, service) => {
                res.send(service[0])
                // console.log('from database', service[0])
            })
    })

    // send order services information in server
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                // console.log(result)
                res.send(result.insertedCount > 0);
            })
        console.log(newOrder);
    })

    // display ordered services in Orders component for all user
    app.get('/orders', (req, res) => {
        // console.log(req.query.email);
        orderCollection.find()
            .toArray((err, result) => {
                res.send(result);
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

    app.get('/admin', (req, res) => {
        adminCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})