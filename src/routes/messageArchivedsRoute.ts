import express from 'express';
import messageArchivedsController from '../controllers/MessageArchivedsController';

const route = express.Router();

route.get('/', messageArchivedsController.index);
route.get('/messageArchived', messageArchivedsController.show);
route.post('/', messageArchivedsController.store);
route.delete('/', messageArchivedsController.delete);

export default route;
