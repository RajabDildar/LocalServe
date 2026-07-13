import { Request, Response, NextFunction } from "express";

const sanitizeValue = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const clean: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      // Drop keys that look like Mongo operators ($gt, $ne, etc.)
      // or dotted paths — both are NoSQL injection vectors.
      if (key.startsWith("$") || key.includes(".")) continue;
      clean[key] = sanitizeValue(value[key]);
    }
    return clean;
  }
  return value;
};

// Sanitizes req.body and req.params only. req.query is intentionally
// left alone — Express 5 made it read-only, and body/params cover the
// realistic injection surface for a JSON API like this one.
export const sanitizeBody = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.params && typeof req.params === "object") {
    for (const key of Object.keys(req.params)) {
      if (
        typeof req.params[key] === "string" &&
        req.params[key].startsWith("$")
      ) {
        req.params[key] = "";
      }
    }
  }
  next();
};
