const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String
    },
    age:{ 
        type:Number
    },
    gender:{
        type:String
    }
})


const User =  mongoose.model("user", userSchema);
//const User1 = mongoose.model("user1", userSchema);
module.exports = User;