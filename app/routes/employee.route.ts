import { Router, Request, Response } from 'express';
import {byId, byApplication} from '../controllers/employee.controller';

let router = Router();

router.get('/:id', (req: Request, res: Response, next: any) => {
    byId(req.params).subscribe(response => res.status(200).json(response), err => next(err));
});

router.get('/byApplication/:applicationId', (req: Request, res: Response, next: any) => {
    byApplication(req.params).subscribe(response => res.status(200).json(response), err => next(err));
});

export default router;