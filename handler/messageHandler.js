const MessagesModel = require('../models/messagesModel');

exports.listOfMessages = function(_req, res) {
  MessagesModel.find(function(err, messages) {
    if (err) {
      return res.sendStatus(500);
    }

    if (messages) {
      return res.json(messages);
    } else {
      return res.status(200);
    }
  });
};

exports.retrieveMessageById = function(req, res) {
  MessagesModel.findById(req.params.messageId)
      .then(
          (message) => {
            if (message) {
              return res.status(200)
                  .json({message: message});
            }
            return res.sendStatus(404);
          },
      ).catch(
          (err) => {
            return res.json(err);
          },
      );
};

exports.deleteMessageById = function(req, res) {
  MessagesModel.findByIdAndRemove(req.params.messageId,
      function(err, _result) {
        if (err) {
          return res.json(err);
        }
        if (_result) {
          return res.sendStatus(204);
        } else {
          return res.sendStatus(404);
        }
      },
  );
};

exports.addMessage = async function(message) {
  const newMessage = new MessagesModel(message);
  return await newMessage.save();
};
