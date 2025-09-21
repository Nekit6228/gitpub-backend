import { model, Schema } from "mongoose";

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
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    gender: {
      type: String,
      enum: ["хлопчик", "дівчинка", "Оберіть стать"],
      default: "Оберіть стать",
      required: true,
    },
    dueDate: {
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
