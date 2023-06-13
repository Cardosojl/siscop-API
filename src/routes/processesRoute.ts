import express from 'express';
import processesController from '../controllers/ProcessesController';

const route = express.Router();

route.get('/', processesController.index);
route.get('/process', processesController.show);
route.post('/', processesController.store);
route.put('/', processesController.update);
route.delete('/', processesController.delete);

export default route;
