import ZAFClient from 'zendesk_app_framework_sdk';
import clubhouse from './clubhouse.js';
var client = ZAFClient.init();

client.on('app.registered', function(appData) {

  let location = appData.context.location;
  let App = require(`./${location}.js`).default;
  new App(client, appData);
  clubhouse.init(client);
});
