import { Request, Response } from 'express';
import {query} from '../../config/sql.config';
import { Application } from '../models/application';

export let list = (req: Request, res: Response) => {
  
  res.json({
    message: 'Applications'
  });
};

export let create = (req: Request, res: Response) => {

  res.json({
    message: 'Create Application'
  });
};

export let edit = (req: Request, res: Response) => {

  res.json({
    message: 'Edit Application'
  });
};

export let deletee = (req: Request, res: Response) => {

  res.json({
    message: 'Delete Application'
  });
};

export let byUser = (req: Request, res: Response) => {
  const sql = `SELECT id_app, name_app FROM light_app WHERE id_app IN (SELECT id_app FROM light_role_emp WHERE id_employee=${req.params.userId} AND active=1 AND id_app!=0 AND active_app!=0 ORDER BY id_app)`;
  query(sql, null, (err: any, rows: any[]) => {
    if (err) {
      console.log(err);
      res.status(500).json(err.sqlMessage);
    }
    let application: Application, applications: Application[] = [];
    rows.forEach(app => {
      application = new Application();
      application.id = app['id_app'];
      application.name = app['name_app'];
      applications.push(application);
    });
    res.status(200).json(applications);
  });
};

