import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import { database } from './database/database.js';
import { errorStatus, notFound } from './middleware/errors.js';
import books from './routes/booksRoutes.js';
import genres from './routes/genresRoutes.js';
import user from './routes/userRoutes.js';
import reviews from './routes/reviewsRoutes.js';
import orders from './routes/ordersRoutes.js';

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: `./.env.${process.env.NODE_ENV}` })
}

const app = express();

dotenv.config();

const PORT = process.env.PORT;
app.use(cors({ origin: `${process.env.HOST}`, exposedHeaders: ['token'] }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
/* app.use(express.static('./views/public')); */
app.use(fileUpload());
app.use(morgan('tiny'));

database();

app.use(express.static('./views/dist'));
app.use('/api/books', books);
app.use('/api/genres', genres);
app.use('/api/user', user);
app.use('/api/reviews', reviews);
app.use('/api/orders', orders);

app.use(notFound);
app.use(errorStatus);

app.listen(PORT, () => console.log('the server is running on port', PORT));
