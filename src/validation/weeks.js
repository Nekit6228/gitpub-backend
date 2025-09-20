import Joi from 'joi';

export const weekParamSchema = Joi.object({
  weekNumber: Joi.number().integer().min(1).max(40).required(),
});

export const dueDateQuerySchema = Joi.object({
  dueDate: Joi.string().isoDate(),
});
