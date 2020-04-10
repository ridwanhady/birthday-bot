const mongoose = require('mongoose');
const {Schema} = mongoose;

const usersSchema = new Schema({
  userId: {type: String, required: true},
  name: {type: String},
  birthday: {type: Date},
});

const usersModel = mongoose.model('Users', usersSchema);

module.exports = usersModel;
