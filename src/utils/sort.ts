type ByStartTime = { startTime: string };
export const byStartTime = (a: ByStartTime, b: ByStartTime) =>
  a.startTime.localeCompare(b.startTime);

type ByDate = { date: string };
export const byDate = (a: ByDate, b: ByDate) => {
  return a.date.localeCompare(b.date);
};
