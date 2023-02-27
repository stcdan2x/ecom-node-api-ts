import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import config from './config.js';

const app = express();

mongoose
  .connect(config.MONGODB_URL!)
  .then(() => {
    console.log('Connected to mongodb.');
  })
  .catch((error) => {
    console.log(error.reason);
  });

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

app.get('/', (req, res) => {
  res.send('Test message from express server');
});

const port = process.env.PORT || 3000;

app.use((err: any, req: any, res: any, next: any) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({ message: err.message });
});

app.listen(config.PORT, () => {
  console.log('serve at http://localhost:5000');
});

app.use(express.static(path.join(__dirname, '/../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../frontend/index.html'));
});

/**
 * TO DO: for front end
 * app.use(express.static(path.join(__dirname, '/../frontend')));
 * app.get('*', (req, res) => {
 * res.sendFile(path.join(__dirname, '/../frontend/index.html'));
 * });
 */
