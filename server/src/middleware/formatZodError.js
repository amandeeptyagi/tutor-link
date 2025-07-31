export const formatZodError = (zodError) => {
  return zodError.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }));
};
