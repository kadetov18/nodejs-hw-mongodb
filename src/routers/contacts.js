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
import { upload } from '../middlewares/multer.js';
const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));
router.get(`/:contactId`, isValidId, ctrlWrapper(getContactByIdController));

router.post(
  `/`,
  upload.single('photo'),
  validateBody(validationBody),
  ctrlWrapper(createContactController),
);

router.patch(
  `/:contactId`,
  upload.single('photo'),
  isValidId,
  validateBody(validationBody),
  ctrlWrapper(patchContactsController),
);

router.delete(`/:contactId`, isValidId, ctrlWrapper(deleteContactController));

export default router;
