const axios = require('axios');

exports.replyMessage = async function(userId, messages) {
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: userId,
    },
    message: messages,
  };

  console.log(payload);
  const FACEBOOK_ENDPOINT = `https://graph.facebook.com/v6.0/me/messages`;
  return await axios.post(
      FACEBOOK_ENDPOINT,
      payload,
      {
        params: {access_token: process.env.MESSENGER_ACCESS_TOKEN},
        headers: {
          'Content-Type': 'application/json',
        },
      });
};
