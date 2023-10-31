const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const Order =require('../models/order-model');
const User = require('../models/user-model')
require('dotenv').config();



const purchasePremium = async(req, res) =>{
    try{
            var rzp = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            })
            console.log('Razorpay id-key object>>>>>>>>>>',rzp);
            const amount =2500;

            rzp.orders.create({amount: amount, currency: "INR"}, async(err, order)=>{
                try{
                    if(err)throw new Error(json.stringify(err));
                    const createdOrder =new Order({orderid:order.id, status:'PENDING'})
                    createdOrder.save();
                   //req.user.orders.push(createdOrder._id);
                    await req.user.save();
                    return res.status(201).json({orderid: order.id, key_id: rzp.key_id})
                  }catch(err){
                    throw new Error(err)}
                })
                    
                }catch(err){console.log("purchasepremium function error", err)}
    }

    const updateTransactionStatus = async (req, res)=>{
            const { payment_id, order_id } = req.body;
            try{
                const order = await Order.findOne({orderid: order_id})
                if(order){
                    order.paymentid = payment_id;
                    order.status = 'successful';
                    await order.save();
                    req.user.ispremiumuser = true;
                    await req.user.save();
                    return res.status(202).json({success: true, message: 'Transaction successful'});
                }else{
                    throw new Error(err);
                }
            }catch(err){
                console.log(err);
                res.status(403).json({error: err, message:'Something went wrong in updating transaction'})
            }
        }
            
                

    module.exports = {
        purchasePremium,
        updateTransactionStatus
    };