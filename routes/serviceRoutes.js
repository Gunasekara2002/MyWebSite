import express from 'express';
import upload from '../middlewares/upload.js';
import { submitServiceForm, getAllServices } from '../controllers/serviceController.js';

const router = express.Router();

//router.post('/:type', auth, upload.array('files'), submitServiceForm);





router.post('/:type', upload.array('files'), submitServiceForm); // ✅ Remove 'auth'

//router.get('/', auth, getAllServices);
router.get('/', getAllServices); 

export default router;
