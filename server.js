const express = require("express");
const cors=require("cors");
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();
//const prodModule = require("./modules/productModule");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;


require('dotenv').config();
app.use(express.json())
;
app.use(cors());

app.get("/", (req,res)=>{
  res.send("API Listening");
});
app.post('/api/listings',async(req,res)=>{
  console.log(req.body)
  try {
      const newListing = await db.addNewListing(req.body);
      console.log(newListing); // Log the newly created listing object
      res.status(201).json(newListing); // Return the newly created listing to the client
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create the listing.' });
  }
});

app.get("/api/listings",async(req,res)=>{
    if(!req.query.perPage||!req.query.page){
        res.status(500).json({message:'Missing parameters'});
    }
    else{
        try{
            let list= await db.getAllListings(req.query.page,req.query.perPage,req.query.name);
            res.send(list);
        }catch(err){
            res.status(404).send({message:err});
        }
    }
});

app.get("/api/listings/:_id",async(req,res)=>{
  try{
      let list=await db.getListingById(req.params._id);
          res.send(list);
  }catch(err){
      res.status(404).send({message:err});
  } 
});

app.put("/api/listings/:_id",async(req,res)=>{
    if(!req.params._id){
        res.status(500).json({message:`Missing parameters`})
    }
    else{
        try{
            await db.updateListingById(req.body,req.params._id);
            res.send({message:"Listing Updated"})
        }catch(err){
            res.status(404).send({message:err});
        }
    }
});

app.delete("/api/listings/:_id",async (req,res)=>{
  try{
      await db.deleteListingById(req.params._id);
      res.send({message:"Listing Deleted"})
  }catch(err){
      res.status(404).send({message:err});
  }
});



db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});
