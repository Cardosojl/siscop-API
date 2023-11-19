import express from 'express';
import FileBufferController from '../controllers/FileBufferController';
import loginValidation from '../middlewares/loginValidation';

const route = express.Router();

route.get('/', FileBufferController.show);

export default route;
