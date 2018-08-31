import { Router } from 'express';
import {list, create, edit, deletee} from '../controllers/artifact.controller';

let router = Router();

router.get('/list', list);
router.get('/create', create);
router.get('/edit/:id', edit);
router.get('/delete/:id', deletee);

export default router;