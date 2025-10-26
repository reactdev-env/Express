const mongoose = require('mongoose');
const validate = require("validator")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value)
        {
if(!validate.isEmail(value)){
    throw new Error("Invalid email address:", + value);
}
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){   
            if(!validate.isStrongPassword(value)) {
                throw new Error ("Please enter the strong password" ,+value);
            }
            },
    },
    age:{ 
        type:Number,
        min:18,
        max:100
    },
    gender:{
        type:String,
        validate(value){   //runs only when you create a new object in the document
            if(!["male","female","others"]. includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ficons%2Fimage&psig=AOvVaw1GsI7gqIQsjW2Rcf-LnQ9L&ust=1761592650205000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjEh5PKwpADFQAAAAAdAAAAABAE"
    },
    skills:{
        type:[String]
    },
    
},
{
        timestamps:true,
    })


const User =  mongoose.model("user", userSchema);
//const User1 = mongoose.model("user1", userSchema);
module.exports = User;