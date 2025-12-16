import { Router } from 'express';
import { warehouseStatus } from '../controllers/warehouseController';

const router = Router();

router.post('/status', warehouseStatus);

export default router;