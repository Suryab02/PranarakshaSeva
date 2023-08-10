const request = require('request'); 
const dotenv = require('dotenv');
const morgan =require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const Blood = require('./models/Blood');
const User = require('./models/User');
const Doctor= require('./models/Doctor');
const Ambulance = require('./models/Ambulance');
dotenv.config({path : './config/config.env'});

connectDB();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=> res.send('hello user'));

app.get('/blood', async (req, res) => {
     console.log(req.query.city);
     console.log(req.query.blood);
   
     let query = { city: req.query.city };
   
     if (req.query.blood) {
       query.name = req.query.blood;
     }
   
     const blood = await Blood.find(query);
     console.log(blood);
   
     res.status(200).json(blood);
   });

   app.post('/getblood', async (req, res) => {
     console.log(req.query.city);
     console.log(req.query.blood);
   
     let query = { city: req.query.city };
   
     if (req.query.blood) {
       query.name = req.body.blood;
     }
   
     const blood = await Blood.find(query);
     console.log(blood);
   
     res.status(200).json(blood);
   });
   

app.get('/doctor',async (req,res)=>{
     console.log(req.query.city);
       let blood = await Doctor.find({city:req.query.city});
       console.log(blood);
       res.status(200).json(blood);
})

app.get('/ambulance',async (req,res)=>{
     console.log(req.query.city);
       let blood = await Ambulance.find({city:req.query.city});
       console.log(blood);
       res.status(200).json(blood);
})

app.get('/bloodcount',async (req,res)=>{
     console.log("query",req.query.bank);
       let blood = await Blood.find({bankname:req.query.bank});
       console.log(blood);
       res.status(200).json(blood);
})

//update blood type
app.post('/bloodcount',async (req,res)=>{
     console.log("query",req.query.bank,req.body);
       let blood = await Blood.findOneAndUpdate({bankname:req.query.bank,name:req.body.name}, {quantity:req.body.count});
       console.log(blood);
       res.status(200).json(blood);
})

app.post('/delete',async (req,res)=>{
     console.log(req.body.name,req.query.bank)
     Blood.findOneAndRemove({ bankname:req.query.bank,name:req.body.name }).then(function(){
          console.log("Data deleted"); // Success
      }).catch(function(error){
          console.log(error); // Failure
      });
       res.status(200).json(true);
})

//add new blood account
app.post('/blood',(req,res)=>{
     const blood = new Blood({name:req.body.name , quantity : req.body.quantity,bankname:req.body.bankname,city:req.body.city});
        let user1;
         blood.save()
        .then(user => {user1 = user;
             res.status(200).send(user1);})
        .catch(err => console.log(err));
})

app.post('/doctor',(req,res)=>{
     const blood = new Doctor({name:req.body.name , qualification : req.body.qualification,contact:req.body.contact,hospital:req.body.hospital,city:req.body.city});
        let user1;
         blood.save()
        .then(user => {user1 = user;
             res.status(200).send(user1);})
        .catch(err => console.log(err));
})

app.post('/ambulance',(req,res)=>{
     const blood = new Ambulance({contact:req.body.contact,hospital:req.body.hospital,city:req.body.city});
        let user1;
         blood.save()
        .then(user => {user1 = user;
             res.status(200).send(user1);})
        .catch(err => console.log(err));
})

app.post('/user',(req,res)=>{
     console.log(req.body)
     const user = new User({username:req.body.username , password : req.body.password,bankname:req.body.bankname});
        let user1;
         user.save()
        .then(user => {user1 = user;
             res.status(200).send(user1);})
        .catch(err => console.log(err));
})

app.post('/validate',async (req,res)=>{
     try{
        console.log(req.body)
        let users = await User.find({username:req.body.username ,password:req.body.password});
       if(users){
          res.status(200).send(users[0].bankname);
       }
       else{
          res.status(200).send(false);
       }
}
       catch (err) {
            console.log(`djwejferkj`)
            res.status(200).send(false);
          }
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`));