import Joi from 'joi';

export const createTaskSchema = Joi.object({
  text: Joi.string().min(3).max(180).required(),
  isActive: Joi.boolean().default(true),
  date: Joi.date().iso().required(),
});

export const updateTaskSchema = Joi.object({
  isActive: Joi.boolean(),
});
