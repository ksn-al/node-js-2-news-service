import { Router } from 'express';
import { registerSchema, getTable } from '../../fileDB';
import { Newspost } from '../../fileDB/types';

const router = Router();

// Реєструємо схему для таблиці newsposts
const newspostSchema = {
  id: Number,
  title: String,
  text: String,
  createDate: Date,
};

registerSchema('newsposts', newspostSchema);
const newspostTable = getTable<Newspost>('newsposts');

// GET /api/newsposts - отримати все новини
router.get('/', (req, res) => {
  try {
    const newsposts = newspostTable.getAll();
    res.json(newsposts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/newsposts/:id - отримати одну новину за id
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const newspost = newspostTable.getById(id);
    
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
    
    const newNewspost = newspostTable.create({
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
    const updatedNewspost = newspostTable.update(id, req.body);
    
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
    const deletedId = newspostTable.delete(id);
    
    if (!deletedId) {
      return res.status(404).json({ error: 'Newspost not found' });
    }
    
    res.status(200).json({ deletedId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
