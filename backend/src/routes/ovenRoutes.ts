import { Router } from 'express';
import { ovenStatus } from '../controllers/ovenController';

const router = Router();

router.post('/status', ovenStatus);

export default router;