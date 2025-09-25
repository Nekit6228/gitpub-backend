import { model, Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const TaskCollection = model('task', taskSchema);
