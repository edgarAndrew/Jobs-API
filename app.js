require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// connect DB
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger package
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// json parser
app.use(express.json());

app.set('trust proxy',1); // express rate limit documentation says that this must be done if we wish to deploy on server
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes (milli seconds)
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

app.use(helmet());
app.use(cors({
    origin:["http://localhost:3000",'https://rainbow-duckanoo-2ef567.netlify.app',"http://localhost:5173","http://localhost:4200","https://edgarandrew.github.io/learning-angular"],
    methods:['GET','POST','PATCH','PUT','DELETE']
}));
app.use(xss());

app.get('/',(req,res)=>{
  res.send(`<h1>Jobs API</h1><a href="/api-docs">Documentation</a>`);
})

// Swagger middleware
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',jobsRouter);

// error handler middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
