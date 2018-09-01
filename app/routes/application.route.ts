import { Router } from 'express';
import {list, create, edit, deletee, byUser} from '../controllers/application.controller';

let router = Router();

router.get('/list', list);
router.get('/create', create);
router.get('/edit/:id', edit);
router.get('/delete/:id', deletee);
router.get('/byUser/:userId', byUser);

export default router;