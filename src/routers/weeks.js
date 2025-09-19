
import { Router } from "express";
import Joi from "joi";
import { authenticate } from "../middlewares/authenticate.js";
import { getWeekPack, calcWeekFromDueDate } from "../services/weeks.js";

const router = Router();

const weekParamSchema = Joi.object({
  week: Joi.number().integer().min(1).max(40).required(),
});

const dueDateQuerySchema = Joi.object({
  dueDate: Joi.string().isoDate().required(),
});


const validate = (schema, source = "params") => (req, res, next) => {
  const { error } = schema.validate(req[source], { abortEarly: false });
  if (error) return res.status(400).json({ message: error.message });
  next();
};


router.use(authenticate);


router.get(
  "/current",
  validate(dueDateQuerySchema, "query"),
  async (req, res, next) => {
    try {
      const { week, daysToDue } = calcWeekFromDueDate(req.query.dueDate);
      const pack = await getWeekPack(week);
      res.json({ week, daysToDue, pack });
    } catch (e) {
      next(e);
    }
  }
);


router.get(
  "/:week",
  validate(weekParamSchema),
  async (req, res, next) => {
    try {
      const week = Number(req.params.week);
      const pack = await getWeekPack(week);
      res.json(pack);
    } catch (e) {
      next(e);
    }
  }
);


router.get(
  "/:week/baby",
  validate(weekParamSchema),
  async (req, res, next) => {
    try {
      const pack = await getWeekPack(Number(req.params.week));
      res.json({ week: pack.week, baby: pack.baby });
    } catch (e) { next(e); }
  }
);

router.get(
  "/:week/mom",
  validate(weekParamSchema),
  async (req, res, next) => {
    try {
      const pack = await getWeekPack(Number(req.params.week));
      res.json({ week: pack.week, mom: pack.mom });
    } catch (e) { next(e); }
  }
);

router.get(
  "/:week/emotions",
  validate(weekParamSchema),
  async (req, res, next) => {
    try {
      const pack = await getWeekPack(Number(req.params.week));
      res.json({ week: pack.week, emotions: pack.emotions });
    } catch (e) { next(e); }
  }
);

export default router;

