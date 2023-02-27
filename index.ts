import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Test message from express server');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on PORT ${port}`));
