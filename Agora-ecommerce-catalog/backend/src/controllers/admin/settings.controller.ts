import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../middleware/error.middleware';
import { query } from '../../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all settings
export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await query<RowDataPacket[]>(
    'SELECT `key`, value FROM store_settings'
  );

  // Convert array to object
  const settingsObj: Record<string, string> = {};
  settings.forEach((setting: RowDataPacket) => {
    settingsObj[setting.key] = setting.value;
  });

  sendSuccess(res, settingsObj);
});

// Update settings
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = req.body;

  for (const [key, value] of Object.entries(settings)) {
    await query<ResultSetHeader>(
      `INSERT INTO store_settings (\`key\`, value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [key, value, value]
    );
  }

  sendSuccess(res, null, 'Settings updated successfully');
});

export default {
  getSettings,
  updateSettings,
};

