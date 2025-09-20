import { getWeekPack } from '../services/weeks.js';
import { calcWeekFromDueDate } from '../utils/calcWeekFromDueDate.js';

export async function getPublicCurrentWeekController(_req, res, next) {
  try {
    const week = 5;
    const daysToDue = 280 - (week - 1) * 7;
    const pack = await getWeekPack(week);
    res.json({ week, daysToDue, pack });
  } catch (e) {
    next(e);
  }
}

export async function getCurrentWeekController(req, res, next) {
  try {
    const { week, daysToDue } = calcWeekFromDueDate(req.query.dueDate);
    const pack = await getWeekPack(week);
    res.json({ week, daysToDue, pack });
  } catch (e) {
    next(e);
  }
}

export async function getWeekController(req, res, next) {
  try {
    const week = Number(req.params.weekNumber);
    const pack = await getWeekPack(week);
    res.json(pack);
  } catch (e) {
    next(e);
  }
}

export async function getWeekBabyController(req, res, next) {
  try {
    const pack = await getWeekPack(Number(req.params.weekNumber));
    res.json({ week: pack.week, baby: pack.baby });
  } catch (e) {
    next(e);
  }
}

export async function getWeekMomController(req, res, next) {
  try {
    const pack = await getWeekPack(Number(req.params.weekNumber));
    res.json({ week: pack.week, mom: pack.mom });
  } catch (e) {
    next(e);
  }
}

export async function getWeekEmotionsController(req, res, next) {
  try {
    const pack = await getWeekPack(Number(req.params.weekNumber));
    res.json({ week: pack.week, emotions: pack.emotions });
  } catch (e) {
    next(e);
  }
}
