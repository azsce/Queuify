export const getTimeAxisTicks = (maxTime: number, arrivalRate: number) => {
  const tickInterval = 1 / arrivalRate;
  const ticks = [];
  for (let t = 0; t <= maxTime; t += tickInterval) {
    ticks.push(Number(t.toFixed(4))); // Avoid floating point precision issues
  }
  return ticks;
};

export const getCustomerAxisTicks = (maxCustomers: number, arrivalRate: number) => {
  const tickInterval = Math.max(1, Math.floor(arrivalRate)); // Ensure minimum interval of 1
  const ticks = [];
  for (let n = 0; n <= maxCustomers; n += tickInterval) {
    ticks.push(n);
  }
  return ticks;
};
