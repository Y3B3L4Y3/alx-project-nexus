import { Request, Response } from 'express';
import { sendCreated } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { query } from '../config/database';
import { ResultSetHeader } from 'mysql2';

// Submit contact form
export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  await query<ResultSetHeader>(
    'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || null, subject, message]
  );

  sendCreated(res, null, 'Message sent successfully! We will get back to you within 24 hours.');
});

export default {
  submitContact,
};

