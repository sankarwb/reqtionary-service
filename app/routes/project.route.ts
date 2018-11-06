import { Router } from 'express';
import { Request, Response } from 'express';
import {projectsGroupbyRelease} from '../controllers/project.controller';

const router = Router();

router.get('/projectsGroupbyRelease/:applicationId', (req: Request, res: Response, next: any) => {
    projectsGroupbyRelease(req.params).subscribe(response => res.status(200).json(response),err => next(err));
});

export default router;