import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validationBody } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get(
  `/contacts/:contactId`,
  isValidId,
  ctrlWrapper(getContactByIdController),
);
router.post(
  `/register`,
  validateBody(validationBody),
  ctrlWrapper(createContactController),
);
router.patch(
  `/contacts/:contactId`,
  isValidId,
  validateBody(validationBody),
  ctrlWrapper(patchContactsController),
);
router.delete(
  `/contacts/:contactId`,
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
