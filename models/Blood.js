const mongoose = require('mongoose')

const Userschema = mongoose.Schema({
    name : {
        type : String , 
        required : [true,'please enter the blood type'],
        
    },
    quantity :
    {type : Number,
     required:[true,'please enter the quantity of blood available']},
    
    bankname : {
        type : String,
        required:[true,'please enter the blood bank name']
    },
    city : {
        type : String,
        required:[true,'please enter the city']
    }

})

module.exports = mongoose.model("Blood",Userschema);