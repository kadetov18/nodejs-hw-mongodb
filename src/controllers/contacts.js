import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContacts,
} from '../service/contacts.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getContactsController = async (req, res, next) => {
  const { page = 1, perPage = 10 } = parsePaginationParams(req.query);
  const { sortBy = 'createdAt', sortOrder = 'asc' } = parseSortParams(
    req.query,
  );

  const userId = req.user._id;

  const totalContacts = await ContactsCollection.countDocuments({ userId });

  const contacts = await ContactsCollection.find()
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalPages = Math.ceil(totalContacts / perPage);

  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems: totalContacts,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const payload = {
    ...req.body,
    userId: req.user._id,
  };

  const contact = await createContact(payload);
  if (!contact) {
    return next(createHttpError(500, 'Something went wrong'));
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const update = req.body;
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updateData = {
    ...update,
    photo: photoUrl,
  };

  const result = await updateContacts(contactId, userId, updateData);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updateData,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};
