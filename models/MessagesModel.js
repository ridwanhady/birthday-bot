const mongoose = require('mongoose');
const {Schema} = mongoose;

const messagesSchema = new Schema({
  userId: {type: String, required: true},
  incoming: {type: String},
  outcoming: {type: String},
  createdAt: {type: Date, default: Date.now()},
  __v: {type: Number, select: false},
});

const messagesModel = mongoose.model('Messages', messagesSchema);

module.exports = messagesModel;
