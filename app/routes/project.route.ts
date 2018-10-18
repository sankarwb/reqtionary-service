import { Router } from 'express';
import { Request, Response } from 'express';
import {byUserAndApplication} from '../controllers/project.controller';

const router = Router();

router.get('/byApplication/:userId/:applicationId', (req: Request, res: Response, next: any) => {
    byUserAndApplication(req.params).subscribe(response => res.status(200).json(response),err => next(err));
});

export default router;