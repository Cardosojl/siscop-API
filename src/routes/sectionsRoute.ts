import express from 'express';
import sectionsController from '../controllers/SectionsController';

const route = express.Router();

route.get('/', sectionsController.index);
route.get('/section', sectionsController.show);
route.post('/', sectionsController.store);
route.put('/', sectionsController.update);
route.delete('/', sectionsController.delete);

export default route;
