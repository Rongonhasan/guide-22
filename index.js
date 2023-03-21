const express = require('express');
const cors = require('cors');
const app = express();
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xng2az1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
          const allServices = client.db('guide').collection('service');
          const allReviews = client.db('guide').collection('reviews');

           app.get('/', async (req, res) => {
            const query = {}
            const cursor = allServices.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });
           app.get('/services', async (req, res) => {
            const query = {}
            const cursor = allServices.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services/:id', async (req, res) => {
            const id=req.params.id 
            const query = {_id: new ObjectId(id)}
           const cursor = await allServices.findOne(query); 
            res.send(cursor );
        });
        // add service
        app.post('/services', async (req, res) => {
            const NewService = req.body;
            const result = await allServices.insertOne(NewService);
            res.send(result);
        });

        // Reveiws add

        app.get('/review', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { email: req.query?.email }
            }
            else if (req.query?.service) {
                query = { service: req.query?.service }
            }
            const cursor = allReviews.find(query)
            const review = await cursor.toArray();
            res.send(review)
        });
      app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await allReviews.insertOne(review);
            res.send(result);
        });
        // delete
        app.delete('/review/:id',  async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allReviews.deleteOne(query);
            res.send(result);
        });
        app.put('/review/:service',async(req,res)=>{
            const service=req.params.service
            const query = { _id: new ObjectId(service) };
            const data=req.body;
            const update={
                $set:{
                    addReview:data.addReview
                }
            }
            const result = await allReviews.updateMany(query,update);
            res.send(result);
        })

    }

    finally {

    }
}
run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send('Guide server is running')
})

app.listen(port, () => {
    console.log(`Guide server running on ${port}`);
})