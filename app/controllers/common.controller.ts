import { Request, Response } from 'express';
import { token } from '../../config/secret';

export let Authenticate = (req: Request, res: Response) => {
  res.setHeader('token', token);
  res.status(200).json({
    id: 18,
    uid: 'A010101',
    type: 1,
    firstName: 'Sankara',
    middleName: 'Swaroop',
    lastName: 'Asapu',
    email: 'sankarasapu@gmail.com',
  });
};


