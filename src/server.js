'use strict';
var app = require('express')();
var http = require('http').Server(app);
// var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// app.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/index.html`);
// });

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const baconIpsum = [
  'Bacon ipsum dolor amet chicken chuck turkey',
  'Drumstick kevin t-bone hamburger tenderloin landjaeger.',
  'Ham porchetta bacon tongue turducken short loin tail pork loin.',
  'Chicken jowl prosciutto kielbasa',
  'Spare ribs salami cow pastrami.'
];

const getBacon = () => baconIpsum[getRandomInt(0, baconIpsum.length)];

let messages = [];
app.get('/messages', (req, res) => {
  res.send(messages);
});

app.post('/message', (req, res) => {
  const newMessage = {text: req.body.text, fromCustomer: true};
  messages.push(newMessage);

  setTimeout(() => {
    messages.push({text: getBacon(), fromCustomer: false});
  }, 2000);

  res.send(newMessage);
})

http.listen(3001, () => {
  console.log('Listening on *:3001');
});
