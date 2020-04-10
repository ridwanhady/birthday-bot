module.exports = {
  REPLY_MESSAGE_FORMAT: {
    UNREGISTERED: `Hi! I am Birthday Bot.
I think this is our first encounter. May I know your first name?`,
    INVALID_NAME: `Sorry, could you please repeat, what is your first name?`,
    NAME_ADDED: `Hi %s! Nice to meet you.
I want to know more about you, could you tell me birthday?
Please tell me in YYYY-MM-DD format.
And uh, mine is 2020-04-14`,
    INVALID_DATE: `Please input your birthday in YYYY-MM-DD format, thanks :)`,
    DATE_ADDED: `Thank you.
Do you want to know how many days till your next birthday?`,
    ASKING_NEXT_BIRTHDAY: `Hi %s!
Do you want to know how many days till your next birthday?`,
    GOODBYE: `Goodbye~~`,
    NEXT_BIRTHDAY: `There are %d days left until your next one!
I believe it will be a good birthday for you`,
  },
  QUICK_BUTTON: [
    {
      'content_type': 'text',
      'title': 'Yes',
      'payload': 'yes',
    }, {
      'content_type': 'text',
      'title': 'No',
      'payload': 'no',
    },
  ],
};
