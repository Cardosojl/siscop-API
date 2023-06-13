import express from 'express';
import processStatesController from '../controllers/ProcessStatesController';

const route = express.Router();

route.get('/', processStatesController.index);
route.get('/processState', processStatesController.show);
route.post('/', processStatesController.store);
route.put('/', processStatesController.store);
route.delete('/', processStatesController.delete);

export default route;
