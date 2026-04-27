import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import checkedOutRoutes from './routes/checkedOutRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

/*
  Load Swagger/OpenAPI docs
*/

let specs;

try {
  specs = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf-8'));
} catch (error) {
  console.log('Failed to load OpenAPI specification', error);
  process.exit(1);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
/*
  Routes 
*/

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/checkedout', checkedOutRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Library API is running',
    docs: '/api-docs',
    health: '/health',
  });
});
/*
  404 handler
*/

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
  Global error handler
*/

app.use((err, req, res, next) => {
  console.log(err.stack);

  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }

  res.status(err.status).json({
    error: err.message,
  });
});

/*
  Start server
*/

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
