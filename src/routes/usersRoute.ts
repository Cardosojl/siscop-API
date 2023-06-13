import express from 'express';
import userController from '../controllers/UsersController';

const route = express.Router();

route.get('/', userController.index);
route.get('/user', userController.show);
route.post('/', userController.store);
route.put('/', userController.update);
route.delete('/', userController.delete);

export default route;
