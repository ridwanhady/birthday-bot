const UsersModel = require('../models/usersModel');
const VERIFICATION_TOKEN = process.env.MESSENGER_VERIFY_TOKEN;
const {replyMessage} = require('../service/replyMessage');
const {REPLY_MESSAGE_FORMAT, QUICK_BUTTON} = require('../const');
const util = require('util');

exports.verifyRequest = function(req, res) {
  console.log('Verifying');
  console.log(VERIFICATION_TOKEN);
  if (req.query['hub.verify_token'] === VERIFICATION_TOKEN) {
    console.log('Webhook verified');
    return res.status(200).send(req.query['hub.challenge']);
  }

  console.error('Verification Token Mismatch');
  return res.sendStatus(403);
};

exports.handleMessage = function(req, res) {
  console.log('Handle Message');
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        console.log(event);
        processMessage(event);
      });
    });
    return res.sendStatus(200);
  }
};

const handleMessageEvent = async function(event) {
  const userId = event.sender.id;
  const user = await UsersModel.findOne({userId: userId});
  if (user == undefined) {
    return await handleUnregisteredUser(event);
  } else {
    return await handleRegisteredUser(event, user);
  }
};

const handleUnregisteredUser = async function(event) {
  if (event.message && event.message.text) {
    const message = event.message.text.toLowerCase();
    const validGreeting = ['hello', 'halo', 'hallo', 'hi', 'hai', 'hey'];
    if (validGreeting.includes(message)) {
      const userId = event.sender.id;
      const user = new UsersModel({userId: userId});
      await user.save();
      try {
        return await replyMessage(userId,
            {
              text: REPLY_MESSAGE_FORMAT.UNREGISTERED,
            });
      } catch (error) {
        return undefined;
      }
    }
  }
  return undefined;
};


const handleRegisteredUser = async function(event, user) {
  if (!user.name) {
    return await addFirstName(event, user);
  } else if (!user.birthday) {
    return await addBirthday(event, user);
  } else {
    return await registered(event, user);
  }
};

const addFirstName = async function(event, user) {
  const message = event.message.text;
  const firstName = (message.split(' ')[0]);

  if (isNameValid(firstName)) {
    user.name = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    await user.save();

    return await replyMessage(
        user.userId,
        {
          text: util.format(REPLY_MESSAGE_FORMAT.NAME_ADDED, user.name),
        });
  } else {
    return await replyMessage(
        user.userId,
        {
          text: REPLY_MESSAGE_FORMAT.INVALID_NAME,
        });
  }
};

const isNameValid = function(name) {
  const nameRE = /^[a-z ,.'-]+$/i;

  return nameRE.test(name);
};

const addBirthday = async function(event, user) {
  const date = event.message.text;

  if (isDateValid(date)) {
    user.birthday = new Date(date);
    await user.save();

    return await replyMessage(user.userId, {
      text: REPLY_MESSAGE_FORMAT.DATE_ADDED,
      quick_replies: QUICK_BUTTON,
    });
  } else {
    return await replyMessage(user.userId,
        {
          text: REPLY_MESSAGE_FORMAT.INVALID_DATE,
        });
  }
};

const isDateValid = function(date) {
  const regexDate = /^\d{4}-\d{1,2}-\d{1,2}$/;

  return regexDate.test(date);
};

const registered = async function(event, user) {
  const message = event.message.text.toLowerCase();
  const yes = ['yes', 'yeah', 'yup', 'gotcha', 'alright', 'y', 'ok', 'ya'];
  const no = ['no', 'nah', 'meh', 'n', 'nope', 'not'];

  if (yes.includes(message)) {
    return await replyMessage(user.userId, {
      text: util.format(
          REPLY_MESSAGE_FORMAT.NEXT_BIRTHDAY,
          getCountNextBirthday(user)),
    });
  } else if (no.includes(message)) {
    return await replyMessage(user.userId, {
      text: REPLY_MESSAGE_FORMAT.GOODBYE,
    });
  } else {
    return await replyMessage(user.userId, {
      text: util.format(REPLY_MESSAGE_FORMAT.ASKING_NEXT_BIRTHDAY, user.name),
      quick_replies: QUICK_BUTTON,
    });
  }
};

const getCountNextBirthday = function(user) {
  const birthday = user.birthday;
  const now = new Date();
  const yearNow = now.getFullYear();
  birthday.setFullYear(yearNow);
  if (birthday < now) {
    birthday.setFullYear(yearNow + 1);
  }
  return Math.round((birthday.getTime() - now.getTime()) / 86400000);
};

const pipeline = [handleMessageEvent];

const processMessage = async (event) => {
  const n = pipeline.length;
  let index = 0;
  let isContinue = true;
  while (index < n && isContinue) {
    const result = await pipeline[index](event);
    if (result != undefined) {
      isContinue = false;
    }
    index++;
  }
};
