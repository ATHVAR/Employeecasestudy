// Task1: initiate app and run server at 3000
const express = require('express'); // requiring express to create a server
const app = express(); //instance of express
require('dotenv').config();
const PORT=process.env.PORT;
const logger = require('morgan'); //logging
app.use(logger('dev'))

app.use(express.json()); // to parse incoming json data
app.use(express.urlencoded({extended:true})); // to parse incoming multi part data
app.listen(PORT,()=>{
    console.log(`server is listening on ${PORT}`);
}); 
const router = require('express').Router();

//DB Connection
const mongoose = require('mongoose')

mongoose.connect(process.env.mongodb_url)
.then(()=>{
    console.log('Mongo DB connection established successfully')
})
.catch(err => console.log('Error connecting', err.message))


//Model(schema)
const employeeSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },

    position:{
        type:String,
        required:true,
    },
    salary:{
        type:Number,
        required:true, 
    }
    
})

const employeeDATA = mongoose.model('employee', employeeSchema)

app.use('/api', router) //sending all employee based  api requests to employee router


//employee.js


//POST OPERATION(CREATE)
router.post('/employeelist', async (req, res) => {

    try {
      const item = req.body;
      const newdata = new employeeDATA(item);
      const saveData = await newdata.save();
      res.status(200).json("POST Successful");
      console.log(req.body)

    } catch (error) {
        console.log(error)
        res.send('error')
    }


})

//GET OPERATION(READ)

router.get('/employeelist', async (req, res) => {
    try {

        let data = await employeeDATA.find()
        // res.send(data)
        res.status(200).json(data)

    } catch (error) {
        console.log(error)
        // res.send('error')
        res.status(400).json(error)
    }
});
router.get('/employeelist/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      // Find the employee by ID
      const employee = await employeeDATA.findById(id);
  
      if (!employee) {
        return res.status(404).send('Employee not found');
      }
  
      res.json(employee);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error retrieving employee');
    }
  });
  
//PUT OPERATION(UPDATE)
router.put('/employeelist', async (req, res) => {
    try {
      const filter = { name: req.body.name }; 
      const updateData = {
        $set: {
          location: req.body.location,
          position: req.body.position,
          salary: req.body.salary
        }
      };
  
      const updatedEmployee = await employeeDATA.findOneAndUpdate(filter, updateData, { new: true });
  
      if (!updatedEmployee) {
        return res.status(404).send('Employee not found');
      }
  
      res.json(updatedEmployee);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error updating employee');
    }
  });
  
// router.put('/employeelist/:id', async (req, res) => {
//     try {
//       const id = req.params.id; // Retrieve the id from the request parameters
//       console.log('id check', id);
//       const updateData = {
//         $set: {
//           name: req.body.name,
//           location: req.body.location,
//           position: req.body.position,
//           salary: req.body.salary
//         }
//       };
  
//       const updated = await employeeDATA.findByIdAndUpdate(id, updateData);
  
//       if (!updated) {
//         return res.status(404).send('Employee not found');
//       }
  
//       res.json(updated);
//     } catch (error) {
//       console.log(error);
//       res.send('error');
//     }
//   });
  
  
//*DELETE OPERATION

router.delete("/employeelist/:id",async (req,res)=>{
  const _id = req.params.id;
  console.log(_id)
  try{
      const deleteOne = await employeeDATA.findByIdAndDelete({_id});
      res.status(200).json("Deleted Successfully");
      console.log('Successfully deleted');
  }catch(error){
      res.status(400).json("Cannot Delete the data")
      console.log('Cannot delete data');
  }
})



 //this is where server starts listening

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));


//TODO: get data from db  using api '/api/employeelist'




//TODO: get single data from db  using api '/api/employeelist/:id'





//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}






//TODO: delete a employee data from db by using api '/api/employeelist/:id'





//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



