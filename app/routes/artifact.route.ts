import {Request, Response, Router} from "express";
import {
    actionArtifact, artifactById, artifactPrerequisites,
    artifactAssociations, artifacts, parentArtifacts
} from "../controllers/artifact.controller";
import { Artifact } from "../models/artifact";

const router = Router();
router.get("/actionTest/:orgId/:appId/:id/:reqTypeId", (req: Request, res: Response, next: any) => {
    const artifact = new Artifact();
    artifact.id = req.params.id;
    artifact.orgId = req.params.orgId;
    artifact.appId = req.params.appId;
    artifact.requirementTypeId = req.params.reqTypeId;
    artifactPrerequisites(artifact).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});

router.get("/parent-artifacts/byApplication/:applicationId", (req: Request, res: Response, next: any) => {
    parentArtifacts(req.params).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});

/******************************** Agile Artifacts ****************************************/

router.get("/agile-artifacts/:applicationId/:projectId/:requirementTypeId", (req: Request, res: Response, next: any) => {
    artifacts(req.params, true).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});
router.get("/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:parentArtifactId", (req: Request, res: Response, next: any) => {
    artifacts(req.params, true).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});
router.get("/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:assignedTo", (req: Request, res: Response, next: any) => {
    artifacts(req.params, true).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});
router.get("/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:parentArtifactId/:assignedTo", (req: Request, res: Response, next: any) => {
    artifacts(req.params, true).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});

/******************************** List Artifacts ****************************************/

router.get("/:applicationId/:projectId/:requirementTypeId", (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});
router.get("/:applicationId/:projectId/:requirementTypeId/:parentArtifactId", (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});
router.get("/:applicationId/:projectId/:requirementTypeId/:assignedTo", (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});
router.get("/:applicationId/:projectId/:requirementTypeId/:parentArtifactId/:assignedTo", (req: Request, res: Response, next: any) => {
    artifacts(req.params).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});
router.get("/:artifactId", (req: Request, res: Response, next: any) => {
    artifactById(req.params).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});
router.get("/associations/:artifactId", (req: Request, res: Response, next: any) => {
    artifactAssociations(req.params).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});

/******************************** Create/Edit Artifact ****************************************/
router.post("/actionArtifact", (req: Request, res: Response, next: any) => {
    actionArtifact(req.body).subscribe(
        (response) => res.json(response),
        (err) => {
            console.log("artifact create error logging in post route");
            next(err);
        }
    );
});

export default router;
