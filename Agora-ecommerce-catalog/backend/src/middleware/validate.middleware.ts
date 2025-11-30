import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { sendValidationError } from '../utils/response';

// Validation middleware
export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      next();
      return;
    }

    // Format errors
    const formattedErrors = errors.array().map((error) => {
      if (error.type === 'field') {
        return {
          field: error.path,
          message: error.msg,
        };
      }
      return {
        field: 'unknown',
        message: error.msg,
      };
    });

    sendValidationError(res, formattedErrors);
  };
};

