const mongoose = require('mongoose');

const lostnfoundSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  itemDescription: {
    type: String,
    required: true
  },
  itemStatus: {
    type: String,
    enum: ['Lost', 'Found'],
    required: true
  },
  choosefile: {
    type: String,
    required: true
  },
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
}, {
  timestamps: true
});


module.exports = mongoose.models.LostnFound || mongoose.model('LostnFound', lostnfoundSchema);