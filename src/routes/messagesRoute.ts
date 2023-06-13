import express from 'express';
import messagesController from '../controllers/MessagesController';

const route = express.Router();

route.get('/', messagesController.index);
route.get('/message', messagesController.show);
route.post('/', messagesController.store);
route.delete('/', messagesController.delete);

export default route;
