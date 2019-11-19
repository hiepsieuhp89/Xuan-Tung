if (process.env.NODE_ENV !== 'production') { // Đọc biến môi trường trong file env ở local
  var env = require('node-env-file');
  env('.env');
}
import fbApi from 'facebook-chat-api';
import fs from 'fs';
import DialogflowHandle from './dialogflow.handle';

const readFileSestion = () => { // Hàm này để đọc file sessions đăng nhập của facebook
  try{
    const file = fs.readFileSync('appstate.json', 'utf8');
    return JSON.parse(file);
  } catch(error) {
    return null;
  }
};
const readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const appState = readFileSestion();
const credientials = { // Tạo biến lưu sesstions, email và mật khẩu fb. (Nêu như đã có sessions và sessions vẫn còn hạn thì không đăng nhập lại)
  appState,
  email: process.env.FB_EMAIL,
  password: process.env.FB_PASSWORD
};
const dialogflowHandle = new DialogflowHandle();

fbApi(credientials, (err, api) => {
  if(err) {
      switch (err.error) {
          case 'login-approval':
              console.log('Enter code > ');
              rl.on('line', (line) => {
                  err.continue(line);
                  rl.close();
              });
              break;
          default: console.error(err);
      }
  }
  fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState())); // Ghi lại sessions mới sau khi đã refresh

  api.listen((err, message) => {
    dialogflowHandle.handleMessage(message.body)
      .then((data) => {
        const result = data[0].queryResult;
        api.sendMessage(result.fulfillmentText, message.threadID);
      })
      .catch((error) => {
          api.sendMessage(`Error: ${error}`, message.threadID);
      });
  });
});