import { Schema, model } from "mongoose";


const weeksSchema = new Schema(
  {
    week: { type: Number, index: true },
    weekNumber: { type: Number, index: true },

  },
  { strict: false, versionKey: false, collection: "weeks" }
);


export const WeeksCollection = model("weeks", weeksSchema);
