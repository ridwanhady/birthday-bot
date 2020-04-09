const mongoose = require('mongoose');
const {Schema} = mongoose;

const MessagesSchema = new Schema({
  userId: {type: String, required: true},
  incoming: {type: String},
  outcoming: {type: String},
  createdAt: {type: Date, default: Date.now()},
  __v: {type: Number, select: false},
});

const Messages = mongoose.model('Messages', MessagesSchema);

module.exports = Messages;
