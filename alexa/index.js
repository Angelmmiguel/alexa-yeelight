import Alexa from 'alexa-app';

// Init the app
const alexaClient = new Alexa.app('Home Lights');

alexaClient.intent('number',
  {
    "slots": {
      "number": "NUMBER"
    },
    "utterances": [
      "say the number {1-100|number}"
    ]
  },
  (request,response) => {
    var number = request.slot('number');
    response.say("You asked for the number "+number);
  }
);

export default alexaClient;
