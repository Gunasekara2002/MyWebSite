/*import express from 'express';
import Employee from '../models/employee.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
/*
// POST  /api/employees
router.post('/', async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET  /api/employees
router.get('/', async (req, res) => {
  try {
    const list = await Employee.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});*/

/*  READ:  GET /api/employees  */
/*router.get('/', protect, async (_req, res) => {
  const list = await Employee.find().sort({ createdAt: -1 });
  res.json(list);
});

/*  READ single:  GET /api/employees/:id  */
/*router.get('/:id', protect, async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: 'Not found' });
  res.json(emp);
});

/*  CREATE:  POST /api/employees  */
//router.post('/', protect, async (req, res) => {
  //const created = await Employee.create(req.body);
  //res.status(201).json(created);
//});
/* routes/personalInfo.js */
/*router.post('/', protect, async (req, res) => {
  const existing = await PersonalInfo.findOne({ user: req.user._id });
  if (existing) {
    await PersonalInfo.updateOne({ user: req.user._id }, req.body);
    return res.json({ message: 'Updated' });
  }
  await PersonalInfo.create({ ...req.body, user: req.user._id });
  res.status(201).json({ message: 'Created' });
});


/*  UPDATE:  PUT /api/employees/:id  */
/*router.put('/:id', protect, async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

/*  DELETE:  DELETE /api/employees/:id  */
/*router.delete('/:id', protect, async (req, res) => {
  const deleted = await Employee.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
*/

import express from 'express';
import Employee from '../models/employee.js';

const router = express.Router();

// POST  /api/employees
router.post('/', async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET  /api/employees
router.get('/', async (req, res) => {
  try {
    const list = await Employee.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });

  }
});
// GET  /api/employees/Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//GET   /api/employee/Edit
router.put('/:id', async (req, res) => {
  try {
    const Update = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Update) return res.status(404).json({ message: 'Not found' });
    res.json(Update);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
