import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().min(1).max(32).optional(),
  email: Joi.string().email().max(64).optional(),
  gender: Joi.string().valid("хлопчик", "дівчинка", "Оберіть стать").optional(),
  dueDate: Joi.date().optional(),
});
