const mongoose = require('mongoose');
const MessageModel = require('./messagesModel');
const messageData = {
  text: 'Hello!',
  createdAt: new Date(),
};
const invalidData = {
  text: 'Hi',
  sender: 'Ridwan',
};
const dotenv = require('dotenv');
dotenv.config();

describe('Message Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
        },
        (err) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
        });
  });

  afterAll(async () => {
    mongoose.connection.close();
    done();
  });

  it('create & save message successfully', async () => {
    const validMessage = new MessageModel(messageData);
    const savedMessage = await validMessage.save();
    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.text).toBe(messageData.text);
    expect(savedMessage.createdAt).toBe(messageData.createdAt);
  });

  it('create & save message successfully, with only text', async () => {
    const validMessage = new MessageModel({text: 'Hello!'});
    const savedMessage = await validMessage.save();
    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.text).toBe(messageData.text);
    expect(savedMessage.createdAt).toBeDefined();
  });

  it('insert user successfully, and ignore unnecessary params', async () => {
    const MessageWithInvalidField = new MessageModel(invalidData);
    const savedMessageWithInvalidField = await MessageWithInvalidField.save();
    expect(savedMessageWithInvalidField._id).toBeDefined();
    expect(savedMessageWithInvalidField.sender).toBeUndefined();
  });

  it('create Message without required field should failed', async () => {
    const MessageWithoutReqField = new MessageModel({createdAt: Date.now()});
    let err;
    try {
      const savedMessageWithoutReqField = await MessageWithoutReqField.save();
      error = savedMessageWithoutReqField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.text).toBeDefined();
  });
});
