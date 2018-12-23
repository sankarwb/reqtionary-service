import {Router, Request, Response} from 'express';
import {artifacts, parentArtifacts, artifactById} from '../controllers/artifact.controller';

const router = Router();

router.get('/parent-artifacts/byApplication/:applicationId', (req: Request, res: Response, next: any) => {
    parentArtifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});

/******************************** Agile Artifacts ****************************************/

router.get('/agile-artifacts/:applicationId/:projectId/:requirementTypeId', (req: Request, res: Response, next: any) => {
    artifacts(req.params, true).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});
router.get('/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:parentArtifactId', (req: Request, res: Response, next: any) => {
    artifacts(req.params, true).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});
router.get('/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:assignedTo', (req: Request, res: Response, next: any) => {
    artifacts(req.params, true).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});
router.get('/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:parentArtifactId/:assignedTo', (req: Request, res: Response, next: any) => {
    artifacts(req.params, true).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});

/******************************** List Artifacts ****************************************/

router.get('/:applicationId/:projectId/:requirementTypeId', (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});
router.get('/:applicationId/:projectId/:requirementTypeId/:parentArtifactId', (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});
router.get('/:applicationId/:projectId/:requirementTypeId/:assignedTo', (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});
router.get('/:applicationId/:projectId/:requirementTypeId/:parentArtifactId/:assignedTo', (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});
router.get('/:artifactId', (req: Request, res: Response, next: any) => {
    artifactById(req.params).subscribe(
        response => res.status(200).json(response),
        err => next(err)
    );
});

export default router;