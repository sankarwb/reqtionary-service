import { Request, Response, Router } from "express";
import { observable } from "rxjs";
import { Authenticate } from "../controllers/auth.controller";

const router = Router();

router.post("/authenticate", (req: Request, res: Response, next: any) => {
    Authenticate(req.params).subscribe(
        (response) => res.status(200).json(response),
        (err) => next(err)
    );
});

export default router;
