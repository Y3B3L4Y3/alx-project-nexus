import { Router } from 'express';
import AddressController from '../controllers/address.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { addressValidator } from '../validators/order.validator';

const router = Router();

// All address routes require authentication
router.use(authenticate);

router.get('/', AddressController.getAddresses);
router.post('/', validate(addressValidator), AddressController.addAddress);
router.put('/:id', validate(addressValidator), AddressController.updateAddress);
router.delete('/:id', AddressController.deleteAddress);
router.put('/:id/default', AddressController.setDefaultAddress);

export default router;

