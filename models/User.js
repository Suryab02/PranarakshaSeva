const mongoose = require('mongoose')

const Userschema = mongoose.Schema({
    username : {
        type : String , 
        required : [true,'please enter your name'],
        
    },
    password :
    {type : String,
     required:[true,'please enter your password']},
    
    bankname : {
        type : String,
        required:[true,'please enter the blood bank name']
    }

})

module.exports = mongoose.model("User",Userschema);