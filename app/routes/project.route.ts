import { Router } from 'express';
import {list, create, edit, deletee, byApplication} from '../controllers/project.controller';

let router = Router();

router.get('/list', list);
router.get('/create', create);
router.get('/edit/:id', edit);
router.get('/delete/:id', deletee);
router.get('/byApplication/:applicationId', byApplication);

export default router;