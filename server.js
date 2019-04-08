const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/static/index.html')));

app.use('/static', express.static(__dirname + '/static'));

const dangerNoodleIntro = "" +
    "                                                ___ \n" +
    `    ^   Danger Noodle listening on port ${port}!  / *_>-<\n` +
    "   | |            _____________               / / \n" +
    "   | \\___________/ ___________ \\_____________/ / \n" +
    "    \\_____________/           \\_______________/ \n";
app.listen(port, () => console.log(dangerNoodleIntro));
