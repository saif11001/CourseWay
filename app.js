const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const morgan = require('morgan');
require('dotenv').config();

const httpStatusText = require('./utils/httpStatusText');

const uri = process.env.MONGO_URL;
const port = process.env.PORT;

const app = express();

const authRouter = require('./routes/auth');
const courseRouter = require('./routes/course');
const userRouter = require('./routes/user');

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: httpStatusText.FAIL,
    message: 'Too many requests, please try again later.',
    },
  });
  app.use(limiter);
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
      title: 'Courses API',
      version: '1.0.0',
      description: 'API documentation for Courses project',
    },
    servers: [
      {
        url: `http://localhost:${port || 4040}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message || 'Something went wrong!';
    const data = error.data || null;
    const errorStatus = error.status || httpStatusText.ERROR;
    res.status(status).json({ message: message, data: data, status: errorStatus });
})

async function main() {
    try{
        await mongoose.connect(uri)
        console.log('Connected to MongoDB');
        app.listen(port || 4040 , () => {
            console.log('Server is running on port ' + ( port || 4040 ) );
        })
    } catch (error) {
        console.log(error);
    }
};

main();