import express from 'express';
import filesController from '../controllers/FilesController';

const route = express.Router();

route.get('/', filesController.index);
route.get('/file', filesController.show);
route.post('/', filesController.store);
route.put('/', filesController.update);
route.delete('/', filesController.delete);

export default route;
