import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb://localhost:27017")

client.connect()
    .then(() => {
        console.log("good")
    }, console.error)
