import {
    Request,
    Response,
    Router
} from "express";
import {byApplication, historyById} from "../controllers/artifact-history.controller";

const router = Router();

router.get("/recent-activity/byApplication/:applicationId", (req: Request, res: Response, next: any) => {
    byApplication(req.params).subscribe((response) => res.status(200).json(response), (err) => next(err));
});

router.get("/:artifactId", (req: Request, res: Response, next: any) => {
    historyById(req.params).subscribe((response) => res.status(200).json(response), (err) => next(err));
});

export default router;
