import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactsController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get(`/contacts/:contactId`, ctrlWrapper(getContactByIdController));
router.post(`/contacts`, ctrlWrapper(createContactController));
router.patch(`/contacts/:contactId`, ctrlWrapper(patchContactsController));
router.delete(`/contacts/:contactId`, ctrlWrapper(deleteContactController));

export default router;
