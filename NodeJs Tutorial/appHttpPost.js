const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({extended: false}));

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

app.post('/login', (req, res) => {
    console.log(req.body);
    res.send('Successfully posted data');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});