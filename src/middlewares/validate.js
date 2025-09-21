export const validate =
  (schema, source = 'params') =>
  (req, res, next) => {
    const { error } = schema.validate(req[source], { abortEarly: false });
    if (error) return res.status(400).json({ message: error.message });
    next();
  };
