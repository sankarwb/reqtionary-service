import { Request, Response, Router } from "express";
import {byApplication, byId} from "../controllers/employee.controller";

const router = Router();

router.get("/:employeeId", (req: Request, res: Response, next: any) => {
    byId(req.params).subscribe((response) => res.status(200).json(response), (err) => next(err));
});

router.get("/byApplication/:applicationId", (req: Request, res: Response, next: any) => {
    byApplication(req.params).subscribe((response) => res.status(200).json(response), (err) => next(err));
});

export default router;
