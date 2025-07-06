const mongoose = require('mongoose');

const carRentalschema = new mongoose.Schema({
    VechicleModel:{
        type: String,
        required: true
        
    },
    RentalAmount:{
        type:String,
        required:true
    },
    RentalPeriod:{
        type:String,
        required:true
    },
    VechileMileage:{
        type:String,
        required:true
    },
    VechicleDescription:{
        type:String,
        required:true
    },
    Available:{
        type:Boolean,
        default:true
    },
    Choosefile:{
        type:String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps : true
});

module.exports = mongoose.models.CarRental || mongoose.model('CarRental', carRentalschema);