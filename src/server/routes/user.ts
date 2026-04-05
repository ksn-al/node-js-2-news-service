import { Router } from 'express';
import { getCurrentUser } from '../controllers/user.controller';
import { requireAuth } from '../passport';

const router = Router();

router.get('/', requireAuth, getCurrentUser);

export default router;