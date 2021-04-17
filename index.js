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

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})