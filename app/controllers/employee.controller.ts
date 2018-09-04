import { Request, Response } from 'express';
import * as sql from '../../config/sql.config';

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

export let byId = (req: Request, res: Response) => {
  res.status(200).json({
    id: 31,
    uid: 'A010101',
    type: 1,
    firstName: 'Sankara',
    middleName: 'Swaroop',
    lastName: 'Asapu',
    email: 'sankarasapu@gmail.com',
  });
};

