import {Router} from 'express';
import {Request, Response} from 'express';
import {byUser} from '../controllers/application.controller';

const router = Router();

router.get('/byUser/:userId', (req: Request, res: Response, next: any) => {
    byUser(req.params).subscribe(response => res.status(200).json(response),err => next(err));
});

export default router;