import * as express from 'express';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

import {valid} from './app/utils/tokenization';
//import * as reload from 'express-reload';

import {print, getPaths} from './app/middleware/app-routes';

import AuthRouter from './app/routes/auth.route';
import EmployeeRouter from './app/routes/employee.route';
import ProjectRouter from './app/routes/project.route';
import ApplicationRouter from './app/routes/application.route';
import RequirementTypeRouter from './app/routes/requirement-type.route';
import AttributeRouter from './app/routes/attribute.route';
import ArtifactRouter from './app/routes/artifact.route';
import AppAgileStatusRouter from './app/routes/application-agile-status.route';
import ArtifactHistoryRouter from './app/routes/artifact-history.route';
import FileUpload from './app/routes/file-upload.route';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* app.configure('development', () => {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
})

app.configure('production', () => {
  app.use(express.errorHandler())
}) */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://107.170.228.97');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, application/json, Origin, X-Requested-With, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// middleware
app.route('/').get(valid, (req, res, next) => {
  const token = req.get('token');
  if (!token) {
    res.status(401).json('un authorized')
  } else {
    next();
  }
});

app.use('/', AuthRouter);
app.use('/employees', EmployeeRouter);
app.use('/applications', ApplicationRouter);
app.use('/projects', ProjectRouter);
app.use('/requirement-type', RequirementTypeRouter);
app.use('/attribute', AttributeRouter);
app.use('/application-agile-status', AppAgileStatusRouter);
app.use('/artifacts', ArtifactRouter);
app.use('/artifact-history', ArtifactHistoryRouter);
app.use('/', FileUpload);

app.route('/routes').get((req, res, next) => {
  app._router.stack.forEach(print.bind(null, []));
  res.status(200).send(getPaths());
});

/* Error Handling */

// Log sql errors
app.use((err: any, req: any, res: any, next: any) => {
  if (err.sqlMessage) {
    console.error(err.sqlMessage);
  }
  next(err);
});

// Log error stack
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  next(err);
});

// send error response
app.use((err: any, req: any, res: any, next: any) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Un Authorized');
  }
  res.status(500).send('Something went wrong');
});

//app.use(reload(`${__dirname}/dist/server.js`));
console.log('MySQL User: ',process.env.MYSQL_USER);
app.listen(process.env.PORT || 3000, () => {
  console.log('App is running at http://localhost:%d in %s mode',
  process.env.PORT, process.env.NODE_ENV);
});

module.exports = app;