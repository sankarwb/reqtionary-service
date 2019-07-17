import {Router} from "express";
import {Request, Response} from "express";
import {byEmployee} from "../controllers/application.controller";

const router = Router();

router.get("/byEmployee/:employeeId", (req: Request, res: Response, next: any) => {
    byEmployee(req.params).subscribe((response) => res.status(200).json(response), (err) => next(err));
});

export default router;
