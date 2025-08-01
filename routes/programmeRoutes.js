import express from 'express';
import { createProgramme, getAllProgrammes } from '../controllers/programmeController.js';

const router = express.Router();

router.post('/programmes', createProgramme);
router.get('/programmes', getAllProgrammes);

export default router;
