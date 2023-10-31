const mongoose = require('mongoose');


const resetpasswordSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        allowNull: false,
        primaryKey: true
    },

active: Boolean,
expireby: Date

})

const Resetpassword = mongoose.model('Resetpassword', resetpasswordSchema)

module.exports = Resetpassword;