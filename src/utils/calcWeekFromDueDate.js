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
