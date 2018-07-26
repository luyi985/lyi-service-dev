const express = require('express');
const { port } = require('config');
const app = express();

app.get('/test', (req, res) => {
    res.json({ msg: 'service runnung' });
});

app.listen(port, () => {
    console.log(`server is running at ${port}`);
});
