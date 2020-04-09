const mongoose = require('mongoose');
const {Schema} = mongoose;

const UsersSchema = new Schema({
  facebookId: {type: String, required: true, index: true},
  name: {type: String},
  birthday: {type: Date},
});

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
