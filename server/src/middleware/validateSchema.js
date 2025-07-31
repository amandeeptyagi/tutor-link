import { formatZodError } from "./formatZodError.js";

export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formatted = formatZodError(result.error);
    return res.status(400).json({ success: false, errors: formatted });
  }
  next();
};
