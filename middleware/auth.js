const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const authenticate = async(req, res, next)=>{
    try{
        const token = req.header('authorization');
        if(!token) return res.status(401).json({success:false, message:'Token Missing & not authenticated'});
        const decodedUser = jwt.verify(token, 'secretKey');
        const userid = decodedUser.userId;
        const user =  await User.findOne({_id: userid}).select('-password');
        req.user = user;
        next();

    }catch (err){
        return res.status(401).json({success:"Not authenticated"});
    }
}

module.exports = {
    authenticate
};





