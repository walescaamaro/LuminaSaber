import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

import { HttpError } from '../errors/HttpError.js';

export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      throw new HttpError(400, 'Validation error', result.error.issues);
    }

    next();
  };
