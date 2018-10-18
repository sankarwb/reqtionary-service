import { Router, Request, Response } from 'express';
import { Authenticate } from '../controllers/auth.controller';
import { observable } from 'rxjs';

let router = Router();

router.post('/authenticate', (req: Request, res: Response, next: any) => {
    Authenticate(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});

export default router;