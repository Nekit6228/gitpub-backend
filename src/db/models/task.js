// src/db/models/task.js
import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 2000 },
    dueDate: { type: Date },
    status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
    owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true, versionKey: false }
);

// назва колекції "tasks"
export const Task = model("tasks", taskSchema);


