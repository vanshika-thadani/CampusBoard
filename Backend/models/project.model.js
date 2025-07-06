const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    projectTitle:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    personrequired:{
        type:Number,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    Technologies:{
        type:[String],
        required:true
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

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);