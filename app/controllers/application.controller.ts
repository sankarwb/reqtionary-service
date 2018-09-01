import { Request, Response } from 'express';
import * as sql from '../../config/secret';

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
  console.log(req);
  const query = `SELECT * from light_app WHERE id_app IN (SELECT id_app FROM light_role_emp WHERE id_employee=${req.params.userId} AND active=1 AND id_app!=0 ORDER BY id_app)`;
  res.status(200).json({
    
  });
};

