
import mongoose from "mongoose";
import { WeeksCollection } from "../db/models/week.js";


async function fetchState(dbName, weekNumber) {
  const conn = mongoose.connection.useDb(dbName);
  return conn.db.collection("states").findOne({ weekNumber });
}

export async function getWeekPack(week) {
  const num = Number(week);


  const doc = await WeeksCollection.findOne({
    $or: [{ week: num }, { weekNumber: num }],
  }).lean();

  let baby = doc?.baby ?? null;
  let mom = doc?.mom ?? null;
  let emotions = doc?.emotions ?? null;


  const needsBaby = !baby;
  const needsMom = !mom;
  const needsEmotions = !emotions;

  if (needsBaby || needsMom || needsEmotions) {
    const [babyDoc, momDoc, emotionsDoc] = await Promise.all([
      needsBaby ? fetchState("baby", num) : Promise.resolve(null),
      needsMom ? fetchState("mom", num) : Promise.resolve(null),
      needsEmotions ? fetchState("emotions", num) : Promise.resolve(null),
    ]);

    if (babyDoc) baby = babyDoc;
    if (momDoc) mom = momDoc;
    if (emotionsDoc) emotions = emotionsDoc;
  }

  return {
    week: num,
    baby,
    mom,
    emotions,
  };
}




export function calcWeekFromDueDate(dueDateStr) {
  const MS_IN_DAY = 24 * 60 * 60 * 1000;
  const EDD = new Date(dueDateStr);
  const today = new Date();

  const daysToDue = Math.ceil((EDD - today) / MS_IN_DAY);


  const TOTAL = 280;
  const gestAgeDays = TOTAL - Math.max(daysToDue, 0);
  const week = Math.min(40, Math.max(1, Math.floor(gestAgeDays / 7) + 1));

  return { week, daysToDue };
}
