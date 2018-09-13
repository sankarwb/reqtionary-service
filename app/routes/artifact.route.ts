import { Router } from 'express';
import {list, create, edit, deletee, parentArtifactsByApplication} from '../controllers/artifact.controller';

let router = Router();

router.get('/list', list);
router.get('/create', create);
router.get('/edit/:id', edit);
router.get('/delete/:id', deletee);
router.get('/parent/byApplication/:applicationId', parentArtifactsByApplication);

export default router;