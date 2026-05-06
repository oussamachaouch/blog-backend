import './config/loadEnv.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connexion from './config/dbConfig.js';
import blogRoute from './routes/blog.js';
import subscriberRoute from './routes/subscriber.js';
import newsRouter from './routes/news.js';
import translationRouter from './routes/translation.js';

const app = express();

// middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}
app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.use('/blogs', blogRoute);
app.use('/newsletter', subscriberRoute);
app.use('/news', newsRouter);
app.use('/translate', translationRouter);

// connect to mongo
connexion();

// start server
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});