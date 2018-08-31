import { Router } from 'express';
import { Authenticate } from '../controllers/common.controller';

let router = Router();

router.get('/authenticate', Authenticate);

export default router;