import dialogflow from 'dialogflow';

export default class DialogflowHandle {
  constructor () {
    this.query = '';
    this.sessionClient = new dialogflow.SessionsClient();
    this.sessionPath =
      this.sessionClient.sessionPath(
        process.env.PROJECT_DIALOGFLOW_ID,
        process.env.DIALOGFLOW_SESSION_ID
      );
    this.request = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: '',
          languageCode: 'en-US',
        },
      },
    };
  }

  handleMessage (sentence) {
    this.request.queryInput.text.text = sentence
    return new Promise(
      (resolve, reject) => {
        this.sessionClient.detectIntent(this.request)
          .then(resolve)
          .catch(reject);
      }
    )
  }
}