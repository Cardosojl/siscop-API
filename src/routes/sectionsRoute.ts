import express from 'express';
import sectionsController from '../controllers/SectionsController';
import loginValidation from '../middlewares/loginValidation';

const route = express.Router();

route.get('/', loginValidation, sectionsController.index);
route.get('/section', loginValidation, sectionsController.show);
route.post('/', loginValidation, sectionsController.store);
route.put('/', loginValidation, sectionsController.update);
route.delete('/', loginValidation, sectionsController.delete);

export default route;
