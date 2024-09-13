import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './service/contacts.js';
const PORT = Number(env('PORT', '3000'));

export const setupServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });

    app.get('/contacts/:contactId', async (req, res) => {
      const { contactId } = req.params;
      console.log(`Requested contactId`, contactId);
      try {
        const contact = await getContactById(contactId);
        if (!contact) {
          return res.status(404).json({ message: 'Contact not found' });
        }
        return res.status(200).json({
          status: 200,
          message: 'Successfully found contact with id {contactId}!',
          data: contact,
        });
      } catch (error) {
        res.status(404).json({ message: 'Contact not found' });
      }
    });

    app.use((req, res, next) => {
      console.log(`Time: ${new Date().toLocaleString()}`);
      next();
    });

    app.use((err, req, res) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err.message,
      });
    });

    app.use('*', (req, res) => {
      res.status(404).json({
        message: 'Not found',
      });
    });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
