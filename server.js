const express = require('express');
const app = express();
const port = 3000;

const socketio = require('./routes/socketio');
socketio.init(app);

app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));
app.use('/static', express.static(__dirname + '/static'));

const dangerNoodleIntro = "" +
    "                                                ___ \n" +
    `    ^   Danger Noodle listening on port ${port}!  / _* >-<\n` +
    "   | |            _____________               / / \n" +
    "   | \\___________/ ___________ \\_____________/ / \n" +
    "    \\_____________/           \\_______________/ \n";
app.listen(port, () => console.log(dangerNoodleIntro));
