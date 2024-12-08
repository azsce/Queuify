export const getTimeAxisTicks = (maxTime: number, arrivalRate: number) => {
  const tickInterval = 1 / arrivalRate;
  const ticks = [];
  for (let t = 0; t <= maxTime; t += tickInterval) {
    ticks.push(Number(t.toFixed(4))); // Avoid floating point precision issues
  }
  return ticks;
};