import { Router } from 'express';
import {
  createNewspost,
  deleteNewspost,
  getNewspostById,
  getNewsposts,
  throwDemoError,
  updateNewspost
} from '../controllers/newsposts.controller';

const router = Router();

router.get('/', getNewsposts);
router.get('/error', throwDemoError);
router.get('/:id', getNewspostById);
router.post('/', createNewspost);
router.put('/:id', updateNewspost);
router.delete('/:id', deleteNewspost);

export default router;
