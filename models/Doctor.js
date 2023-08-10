const mongoose = require('mongoose')

const Userschema = mongoose.Schema({
    name : {
        type : String , 
        required : [true,'Doctor name'],
        
    },
    qualification :
    {type : String,
     required:[true,'speciality']},
    
    contact : {
        type : String,
        required:[true,'please enter the blood bank name']
    },
    hospital : {
        type : String,
        required:[true,'please enter the blood bank name']
    },
    city : {
        type : String,
        required:[true,'please enter the city']
    }

})

module.exports = mongoose.model("Doctor",Userschema);