const mongoose = require('mongoose');
const {Schema} = mongoose;

const messagesSchema = new Schema({
  text: {type: String, required: true},
  createdAt: {type: Date, default: Date.now()},
  __v: {type: Number, select: false},
});

const messagesModel = mongoose.model('Messages', messagesSchema);

module.exports = messagesModel;
