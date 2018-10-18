import * as express from 'express';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
import {valid} from './app/utils/tokenization';
//import * as reload from 'express-reload';

import {print, getPaths} from './app/middleware/app-routes';

import AuthRouter from './app/routes/auth.route';
import EmployeeRouter from './app/routes/employee.route';
import ProjectRouter from './app/routes/project.route';
import ApplicationRouter from './app/routes/application.route';
import RequirementTypeRouter from './app/routes/requirement-type.route';
import ArtifactRouter from './app/routes/artifact.route';
import AppAgileStatusRouter from './app/routes/application-agile-status.route';
import ArtifactHistoryRouter from './app/routes/artifact-history.route';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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
app.use('/application-agile-status', AppAgileStatusRouter);
app.use('/artifacts', ArtifactRouter);
app.use('/artifact-history', ArtifactHistoryRouter);
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

app.listen(app.get('port'), () => {
  console.log(('App is running at http://localhost:%d in %s mode'),
  app.get('port'), app.get('env'));
});

module.exports = app;