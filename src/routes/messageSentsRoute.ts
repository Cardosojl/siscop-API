import express from 'express';
import messageSentsControler from '../controllers/MessageSentsControler';

const route = express.Router();

route.get('/', messageSentsControler.index);
route.get('/messageSent', messageSentsControler.show);
route.delete('/', messageSentsControler.delete);

export default route;
