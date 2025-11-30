import { Router } from 'express';
import ContactController from '../controllers/contact.controller';
import { validate } from '../middleware/validate.middleware';
import { contactValidator } from '../validators/order.validator';

const router = Router();

router.post('/', validate(contactValidator), ContactController.submitContact);

export default router;

