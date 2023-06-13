import express from 'express';
import loginController from '../controllers/LoginController';

const route = express.Router();

route.post('/login', loginController.store);
route.delete('/logoff', loginController.delete);

export default route;
