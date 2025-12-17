import { Router } from 'express';
import { craneStatus } from '../controllers/craneController';

const router = Router();

router.post('/status', craneStatus);

export default router;