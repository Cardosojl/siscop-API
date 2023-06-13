import express from 'express';
import YearsController from '../controllers/YearsController';

const router = express.Router();

router.post('/', YearsController.store);
router.get('/', YearsController.index);
router.get('/year', YearsController.show);
router.put('/', YearsController.update);
router.delete('/', YearsController.delete);

export default router;
