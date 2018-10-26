import express from 'express';
import mongoose from 'mongoose';

import apiRoutes from './routes/api_routes';
import authRoutes from './routes/auth_routes';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true }).then(() => {
  console.log('Successfully connected to database!');
}).catch((err) => {
  console.log(`Unable to connect to database: ${err}`);
});

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json('Welcome Home!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
