import { Router } from 'express';
import { Request, Response } from 'express';
import {fileUpload} from '../controllers/file-upload.controller';

const router = Router();

router.post('/fileupload', (req: Request, res: Response, next: any) => {
    fileUpload(req, res).subscribe(response => res.status(200).json(response), err => next(err));
});

export default router;