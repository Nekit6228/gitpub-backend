import { Router } from "express";
import Joi from "joi";
import { isValidObjectId } from "mongoose";
import { Task } from "../db/models/task.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();


const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.message });
  next();
};

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow("").max(2000),
  dueDate: Joi.date(),
  status: Joi.string().valid("todo", "in_progress", "done").default("todo"),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid("todo", "in_progress", "done").required(),
});


router.use(authenticate);


router.post("/", validate(createTaskSchema), async (req, res, next) => {
  try {
    const doc = await Task.create({ ...req.body, owner: req.user._id });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});


router.get("/", async (req, res, next) => {
  try {
    const { status } = req.query;

    const pageNum = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.json({ total, page: pageNum, limit: limitNum, items });
  } catch (e) {
    next(e);
  }
});


router.patch("/:id/status", validate(updateStatusSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const { status } = req.body;

    const doc = await Task.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!doc) return res.status(404).json({ message: "Task not found" });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

export default router;

