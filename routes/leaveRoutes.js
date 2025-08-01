// server/routes/leaveRoutes.js
/*import express from 'express';
import { createLeave, getdeleteLeaves, getLeaves } from '../controllers/leaveController.js';

const router = express.Router();

router.post('/', createLeave);
router.get('/', getLeaves);
//router.get('/',getdeleteLeaves)
// GET  /api/employees/Delete
router.delete('/:id', leaveController.deleteLeave);
router.put('/:id', leaveController.updateLeave);
  

export default router;*/
import express from 'express';
import {
  createLeave,
  getLeaves,
  deleteLeave,
  updateLeave
} from '../controllers/leaveController.js';

const router = express.Router();

router.post('/', createLeave);
router.get('/', getLeaves);
router.delete('/:id', deleteLeave);
router.put('/:id', updateLeave);

export default router;

