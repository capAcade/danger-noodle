const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Danger Noodle!'));

app.listen(port, () => console.log(`Danger Noodle listening on port ${port}!`));
