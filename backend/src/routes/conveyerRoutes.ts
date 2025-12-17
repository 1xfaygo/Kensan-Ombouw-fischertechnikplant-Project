import { Router } from 'express';
import { conveyerStatus } from '../controllers/conveyerController';

const router = Router();

router.post('/status', conveyerStatus);

export default router;