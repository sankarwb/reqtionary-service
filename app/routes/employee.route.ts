import { Router } from 'express';
import {list, create, edit, deletee, byId} from '../controllers/employee.controller';

let router = Router();

router.get('/list', list);
router.get('/create', create);
router.get('/edit/:id', edit);
router.get('/delete/:id', deletee);
router.get('/:id', byId);

export default router;