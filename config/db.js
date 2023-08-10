const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.uri , {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
    console.log(`Database connected`);
    }
    catch(er){
         console.log(`{message:${er.message}}`)
         process.exit(1)
    }
}

module.exports = connectDB ;