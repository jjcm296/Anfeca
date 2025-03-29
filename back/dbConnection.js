const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://anfecaconcentratda:Password321@cluster0.jxijpiz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

require('dotenv').config();

const uri = process.env.DB_URI

const client = new MongoClient(uri, {
   serverApi: {
       version: ServerApiVersion.v1,
       strict:true,
       deprecationErrors:true,
   }
});

async function run() {
    try {
        await client.connect();

        await client.db("admin").command({ ping:1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
    } finally {
        await client.close()
    }
}

run().catch(console.dir);