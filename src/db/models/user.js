import { model, Schema } from "mongoose";
import Joi from "joi";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [32, "Name cannot exceed 32 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      maxlength: [64, "Email cannot exceed 64 characters"],
      match: [
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Email is invalid",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
      select: false,
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    // Поля для відновлення паролю
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserCollections = model("users", userSchema);

// Joi-схема для оновлення профілю користувача
// Вимагає щоб був хоча б один з перелічених полів
export const updateUserSchema = Joi.object({
  name: Joi.string().max(32).trim(),
  email: Joi.string().email().max(64).trim().lowercase(),
  password: Joi.string().min(8).max(128),
  avatar: Joi.string().uri().allow(""),
  gender: Joi.string().valid("male", "female", "other"),
  dueDate: Joi.date().allow(null),
}).min(1);