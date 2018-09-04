import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
//import * as reload from 'express-reload';

import CommonRouter from './app/routes/common.route';
import EmployeeRouter from './app/routes/employee.route';
import ProjectRouter from './app/routes/project.route';
import ApplicationRouter from './app/routes/application.route';
import ArtifactRouter from './app/routes/artifact.route';

dotenv.config();
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// middleware
app.get('/', (req, res, next) => {
  const token = req.get('token');
  if (!token) {
    res.status(401).json('un authorized')
  } else {
    next();
  }
});

app.use('/', CommonRouter);
app.use('/employees', EmployeeRouter);
app.use('/applications', ApplicationRouter);
app.use('/projects', ProjectRouter);
app.use('/artifacts', ArtifactRouter);

//app.use(reload(`${__dirname}/dist/server.js`));

app.listen(app.get('port'), () => {
  console.log(('App is running at http://localhost:%d in %s mode'),
  app.get('port'), app.get('env'));
});

module.exports = app;