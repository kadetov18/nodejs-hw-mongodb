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
import { authenticate } from '../middlewares/authenticate.js';
const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));
router.get(`/:contactId`, isValidId, ctrlWrapper(getContactByIdController));

router.post(
  `/`,
  validateBody(validationBody),
  ctrlWrapper(createContactController),
);

router.patch(
  `/:contactId`,
  isValidId,
  validateBody(validationBody),
  ctrlWrapper(patchContactsController),
);

router.delete(`/:contactId`, isValidId, ctrlWrapper(deleteContactController));

export default router;
