const mongoose = require('mongoose');
const UserModel = require('./usersModel');
const validUserData = {
  userId: '1234567890',
  name: 'Ridwan',
  birthday: new Date('1998-08-31'),
};
const invalidData = {
  userId: '1234567890',
  firstName: 'Ridwan',
};
const dotenv = require('dotenv');
dotenv.config();

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
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

  it('create & save user successfully', async () => {
    const validUser = new UserModel(validUserData);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.userId).toBe(validUserData.userId);
    expect(savedUser.name).toBe(validUserData.name);
    expect(savedUser.birthday).toBe(validUserData.birthday);
  });

  it('create & save User successfully, with only userId', async () => {
    const validUser = new UserModel({userId: '1234567890'});
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.userId).toBe('1234567890');
    expect(savedUser.name).toBeUndefined();
    expect(savedUser.birthday).toBeUndefined();
  });

  it('insert user successfully, and ignore unnecessary params', async () => {
    const UserWithInvalidField = new UserModel(invalidData);
    const savedUserWithInvalidField = await UserWithInvalidField.save();
    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.firstName).toBeUndefined();
  });

  it('create User without required field should failed', async () => {
    const UserWithoutReqField = new UserModel({birthday: Date.now()});
    let err;
    try {
      const savedUserWithoutReqField = await UserWithoutReqField.save();
      error = savedUserWithoutReqField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.userId).toBeDefined();
  });
});
