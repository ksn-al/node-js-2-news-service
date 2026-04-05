import { Router } from 'express';
import {
  createNewspost,
  deleteNewspost,
  getNewspostById,
  getNewsposts,
  throwDemoError,
  updateNewspost
} from '../controllers/newsposts.controller';
import { requireAuth } from '../passport';

const router = Router();

router.get('/', getNewsposts);
router.get('/error', throwDemoError);
router.get('/:id', getNewspostById);
router.post('/', requireAuth, createNewspost);
router.put('/:id', requireAuth, updateNewspost);
router.delete('/:id', requireAuth, deleteNewspost);

export default router;
