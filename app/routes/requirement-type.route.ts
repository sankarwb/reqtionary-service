import {
    Request,
    Response,
    Router
} from "express";
import {byApplication} from "../controllers/requirement-type.controller";

const router = Router();

router.get("/byApplication/:applicationId", (req: Request, res: Response, next: any) => {
    byApplication(req.params).subscribe((response) => res.status(200).json(response), (err) => next(err));
});

export default router;
