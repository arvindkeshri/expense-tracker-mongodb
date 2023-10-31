const express = require('express');
const app = express();
require('dotenv').config();
const {connectToMongoDB} = require('./util/mongoose')


//import and middlewares
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(bodyParser.json());

//use static files 
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "images")));



//import models and database
const User = require ('./models/user-model');
const Order = require('./models/order-model')
const Expense = require('./models/expense-model');

//import routes
const userRouter = require('./routes/user');
const expenseRouter = require('./routes/expenses');
const purchaseRouter = require('./routes/purchase');
const premiumRouter = require('./routes/premium');
const passwordRouter = require('./routes/password');
const Resetpassword = require('./models/password-model');

// model relations


//route directs
app.use('/', userRouter);
app.use('/expense',expenseRouter);
app.use('/purchase',purchaseRouter);
app.use('/premium', premiumRouter)
app.use('/password', passwordRouter)

app.use((req, res)=>{
    res.sendFile(path.join(__dirname,`/views/${req.url}`));
})

//start the server
const port = process.env.PORT || 3000;
connectToMongoDB().then(()=>{       
 app.listen(port, ()=>{
 console.log(`${port} port Server running`);
})
}).catch((err)=>{
        console.error('DB connection error', err)
})




















