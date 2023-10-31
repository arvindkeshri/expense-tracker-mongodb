const express = require('express');
const User = require("../models/user-model");
const Expense = require("../models/expense-model");
const routes = express.Router();
const path = require("path");
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
require('dotenv').config();


const addExpense = async (req, res) => {  
    try {
            const { amount, description, field } = req.body;
            const userId = req.user.id;

            const newExpense = new Expense({amount, description, field, userId});
            await newExpense.save();
            
            const user = await User.findOne({_id: userId});
            user.total =user.total +  newExpense.amount; 
            await user.save();

            return res.status(200).json({expense: newExpense}); 
      }
       catch (err) {
      console.error("Unable to add expense to database", err);
      res.status(500).send({message: "Unable to add expense to database", error: err});
    }
  }

  



const getExpenses = async (req, res)=>{
    try{
        const expenses = await  Expense.find({userId: req.user.id});
        return res.status(200).json({expenses}); 
    }catch(err){
      console.error('Error fetching expenses from database', err);
      res.status(500).json({error: 'Internal Server Error'});
    }
}



const deleteExpense = async (req, res) => {  
    try {
            const uid = req.params.id;
            const deleteExpense = await Expense.findById(uid);

            if(deleteExpense) {
                const user = await User.findOne({_id: deleteExpense.userId});
                user.total = user.total - deleteExpense.amount;
                await user.save();
                await deleteExpense.remove();
                res.status(204).json({ success: true,message:"deleted successfully"})
            }else{
              throw new Error('ERROR TO DELETE');
            } 
        }
       catch (err) {
      console.error("Unable to delete expense to database", err);
      res.status(500).send({message: "Unable to delete expense to database", error: err});
    }
  }


  function uploadToS3(data, filename){
    //get credentials, login to AWS and upload the file.
    const BUCKET_NAME = 'expensetrackerfullstack1';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    })

     //params Bucket, Key, Body as required by AWS S3
    const params = {                               
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read'
    }

    // return promise instead direct return as uploading is an asynchronous task
    return new Promise((resolve, reject)=>{
      s3bucket.upload(params, async (err, s3response)=>{
        try{
          if(err) {
            console.log("Error uploading file", err);
            reject(err);
          }else{
            console.log('File uploaded successfully', s3response)
            resolve(s3response.Location);
          }
        }catch(err){
          console.log("Waiting to login in AWS for upload", err)
        }
     
      })
    })
  }



  const downloadExpense = async (req, res) =>{
    try{
      console.log(req.user)
      const expenses = await Expense.find({_id:req.user._id})
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = `expense${req.user.id}_${new Date()}.txt`;
      const fileUrl = await uploadToS3(stringifiedExpenses, filename);

      res.status(200).json({fileUrl: fileUrl, success:true, filename: filename});

    }catch(err){
      console.log("Error downloading expenses file", err);
      res.status(500).json({error: 'Error downloading expenses'});
    }

  }







  module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    downloadExpense
  }




