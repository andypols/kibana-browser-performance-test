import {getElasticIndexUrl} from './get-settings';
import {isEmpty} from "lodash";

const MESSAGE_BUFFER = 40;

async function post(data) {
  console.log(`Posting...`)
  const elasticIndexUrl = await getElasticIndexUrl();

  if(isEmpty(elasticIndexUrl)) {
    console.log('The elasticIndexUrl has not specified. Ignoring data post.')
  } else {
    fetch(`${elasticIndexUrl}/_bulk`, {
      method: 'POST',
      body: data,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).catch((err => {
      console.log("Failed to send data:", err);
    }));
  }
}


export default class MessageSender {
  constructor() {
    this.messages = [];
  }

  postMessage(index, message) {
    this.messages.push({index, message});

    if(this.messages.length > MESSAGE_BUFFER) {
      this.flush();
    }
  }

  flush() {
    this.send([...this.messages]);
    this.messages = [];
  }

  send(messages) {
    post(messages.map(message => `{"index":{"_index":"${message.index}"}\n${JSON.stringify(message.message)}\n`).join(''));
  }
}