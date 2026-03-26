import { Router } from 'express';
import newspostsService from '../modules/newsposts/service';
import { PaginationParams } from '../modules/newsposts/types';

const router = Router();

function parsePaginationParams(query: Record<string, unknown>): PaginationParams {
  const pageRaw = typeof query.page === 'string' ? Number(query.page) : NaN;
  const sizeRaw = typeof query.size === 'string' ? Number(query.size) : NaN;

  const page = Number.isInteger(pageRaw) && pageRaw >= 0 ? pageRaw : 0;
  const size = Number.isInteger(sizeRaw) && sizeRaw > 0 ? sizeRaw : 10;

  return { page, size };
}

// GET /api/newsposts - отримати все новини
router.get('/', (req, res) => {
  try {
    const params = parsePaginationParams(req.query as Record<string, unknown>);
    const newsposts = newspostsService.getAll(params);
    res.json(newsposts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/newsposts/:id - отримати одну новину за id
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const newspost = newspostsService.getById(id);
    
    if (!newspost) {
      return res.status(404).json({ error: 'Newspost not found' });
    }
    
    res.json(newspost);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/newsposts - створити нову новину
router.post('/', (req, res) => {
  try {
    const { title, text } = req.body;
    
    if (!title || !text) {
      return res.status(400).json({ error: 'Title and text are required' });
    }
    
    const newNewspost = newspostsService.create({
      title,
      text,
    });
    
    res.status(201).json(newNewspost);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/newsposts/:id - оновити новину
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const updatedNewspost = newspostsService.update(id, req.body);
    
    if (!updatedNewspost) {
      return res.status(404).json({ error: 'Newspost not found' });
    }
    
    res.json(updatedNewspost);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/newsposts/:id - видалити новину
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const deletedId = newspostsService.delete(id);
    
    if (!deletedId) {
      return res.status(404).json({ error: 'Newspost not found' });
    }
    
    res.status(200).json({ deletedId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
