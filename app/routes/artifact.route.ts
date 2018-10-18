import {Router, Request, Response} from 'express';
import {artifacts, parentArtifactsByApplication} from '../controllers/artifact.controller';

const router = Router();

router.get('/parent/byApplication/:applicationId', (req: Request, res: Response, next: any) => {
    parentArtifactsByApplication(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    )
});
router.get('/:applicationId/:projectId', (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    )
});
router.get('/:applicationId/:projectId/:parentArtifactId', (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    )
});
router.get('/:applicationId/:projectId/:assignedTo', (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    )
});
router.get('/:applicationId/:projectId/:parentArtifactId/:assignedTo', (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    )
});

export default router;