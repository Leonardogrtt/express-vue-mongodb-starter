require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const axios = require('axios')

// MONGO DB

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbName = "mevn-db"
const dbConnectionString = `mongodb+srv://${dbUser}:${dbPass}@cluster0.lxeds.gcp.mongodb.net/${dbName}?retryWrites=true`

const MongoClient = require('mongodb').MongoClient

MongoClient.connect(dbConnectionString, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(client => {

        console.log(`connected to mongoDB`)
        const db = client.db('mevn-db')
        const usersCollection = db.collection('users')

        // REQUEST HANDLERS HERE

        app.post('/users-collection', (req, res) => {

            usersCollection.insertOne(req.body)
                .then(result => {
                    console.log(`user added to collection`)
                    res.send(result)
                })
                .catch(err => {
                    console.error(err)
                    res.send({ error: err})
                })
        })

        app.get('/users-collection', (req, res) => {

            console.log(`getting cursor`)
            const cursor = usersCollection.find().toArray()
                .then(results => {
                    console.log(results)
                    res.json(results)
                })
                .catch(err => {
                    console.error(err)
                    res.send(`error: ${err}`)
                })

        })

    })
    .catch(err => {
        console.error(err)
    })


// / MONGO DB

const app = express()
const port = process.env.APP_PORT || 5000

const introJSON = [{ 
    "title":"stack-express-vue-mongodb-0.0.0", 
    "description": "my personal api", 
    "author": "Leonardo Girotto <leonardogrtt@gmail.com>" 
}]

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).send(introJSON)
})
app.get('/api', (req, res) => {
    res.status(200).send(introJSON)
})
app.get('/api/users', (req, res) => {

    axios.get('http://jsonplaceholder.typicode.com/users')
        .then(response => {
            //console.log(response.data)
            res.status(200).json(response.data)
        })
        .catch(err => {
            if(err.response) {
                // The request was made ant the server
                //responded with a status code that falls
                //out of the range of 2xx
                console.log(err.response.data)
                console.log(err.response.status)
                console.log(err.response.headers)
            } else if(err.request) {
                // The request was made but no response was received, 
                //`err.request` is an instance of XMLHttpRequest
                //in the browser and an instance of http.ClientRequest in Node.js
                console.log(err.request)
            } else {
                // Something happened in setting up the request and triggered an Error
                console.log('Error', err.message)
            }
            console.log(err.config)

        })
})
app.get('/api/posts', (req, res) => {

    console.log(`request path:`, req.url)
    console.log(`request method:`, req.method)
    console.log(`request accepts:`, req.headers.accept)

    axios.get('http://jsonplaceholder.typicode.com/posts',  {headers: {'Content-Type':'application/json'}})
        .then(response => {
            //console.log(response.data)
            res.status(200).json(response.data)
        })
        .catch(err => {
            if(err.response) {
                // The request was made ant the server
                //responded with a status code that falls
                //out of the range of 2xx
                console.log(err.response.data)
                console.log(err.response.status)
                console.log(err.response.headers)
            } else if(err.request) {
                // The request was made but no response was received, 
                //`err.request` is an instance of XMLHttpRequest
                //in the browser and an instance of http.ClientRequest in Node.js
                console.log(err.request)
            } else {
                // Something happened in setting up the request and triggered an Error
                console.log('Error', err.message)
            }
            console.log(err.config)

        })
})

app.listen(port, () => {
    console.log(`API Server listening on port ${port}`)
})