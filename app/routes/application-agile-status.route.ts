import {Router, Request, Response} from 'express';
import {byApplication} from '../controllers/application-agile-status.controller';

let router = Router();

router.get('/statuses/byApplication/:applicationId', (req: Request, res: Response, next: any) => {
    byApplication(req.params).subscribe(response => res.status(200).json(response), err => next(err));
});

export default router;