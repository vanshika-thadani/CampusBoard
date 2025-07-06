const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:false
    },
    profilephoto:{
        type : String,
        required:true,
        default: 'src/assets/Profile.jpg'
    },
    carpools:{
        type:[mongoose.Schema.Types.ObjectId],
        ref : 'Carpool',
        default:[]
    },
    carrentals:{
        type:[mongoose.Schema.Types.ObjectId],
        ref : 'CarRental',
        default:[]
    },
    lostnfound:{
        type:[mongoose.Schema.Types.ObjectId],
        ref : 'LostnFound',
        default:[]
    },
    projects:{
        type:[mongoose.Schema.Types.ObjectId],
        ref : 'Projects',
        default:[]
    }
},
{
    timestamps : true
});


const User = mongoose.model('User',userSchema);
module.exports= User;