const mongoose = require('mongoose')

const Userschema = mongoose.Schema({
   contact :
    {type : String,
     required:[true,'contact']},
    
    hospital : {
        type : String,
        required:[true,'please enter the blood bank name']
    },
    city : {
        type : String,
        required:[true,'please enter the city']
    }

})

module.exports = mongoose.model("Ambulance",Userschema);