const express = require('express');
const fileUpload = require("express-fileupload");

const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpuow.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());
app.use(express.static("mobiledata"));
app.use(fileUpload());


const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("mobileservice").collection("mobiledata");
  const reviewsCollection = client.db("mobileservice").collection("mobiledata");
  const ordersCollection = client.db("mobileservice").collection("mobiledata");
  const adminsCollection = client.db("mobileservice").collection("mobiledata");
  console.log('connected')


app.post("/addService", (req, res) => {
  const file = req.files.file;
  const name = req.body.name;
  const description = req.body.description;
  const newImg = file.data;
  const encImg = newImg.toString("base64");

  var image = {
    contentType: file.mimetype,
    size: file.size,
    img: Buffer.from(encImg, "base64"),
  };

  servicesCollection
    .insertOne({ name, description, image })
    .then((result) => {
      res.send(result.insertedCount > 0);
      console.log('database found');
    });
});


app.get("/services", (req, res) => {
  servicesCollection.find({}).toArray((err, documents) => {
    res.send(documents);
  });
});

app.get("/reviews", (req, res) => {
  reviewsCollection.find({}).toArray((err, documents) => {
    res.send(documents);
  });
});

app.post("/addReview", (req, res) => {
  const review = req.body;
  reviewsCollection.insertOne(review).then((result) => {
    res.send(result.insertedCount > 0);
  });
});

app.get("/servicesOrdered", (req, res) => {
  ordersCollection
    .find({ email: req.query.email })
    .toArray((err, documents) => {
      res.send(documents);
    });
});

app.get("/allServicesOrdered", (req, res) => {
  ordersCollection.find({}).toArray((err, documents) => {
    res.send(documents);
  });
});

app.post("/addOrder", (req, res) => {
  const order = req.body;
  ordersCollection.insertOne(order).then((result) => {
    res.send(result.insertedCount > 0);
  });
});

app.post("/addAdmin", (req, res) => {
  const admin = req.body;
  adminsCollection.insertOne(admin).then((result) => {
    res.send(result.insertedCount > 0);
  });
});

app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });


  //client.close();
});
app.get("/", (req, res) => {
  res.send("Welcome to MobileService");
});
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(process.env.PORT || port);