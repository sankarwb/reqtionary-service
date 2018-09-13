import { Router } from 'express';
import {byApplication} from '../controllers/requirement-type.controller';

let router = Router();

router.get('/byApplication/:applicationId', byApplication);

export default router;