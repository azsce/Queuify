export function dd1(
  arrivalRate: number,
  serviceRate: number,
  time: number,
  capacity?: number
) {
  if (arrivalRate <= serviceRate) {
    const n = Math.floor(arrivalRate * time) - Math.floor(serviceRate * time - serviceRate / arrivalRate);
    const Wq = (1 / serviceRate - 1 / arrivalRate) * (n - 1);
    return { n, Wq };
  } else {
    if (capacity === undefined) {
      throw new Error("System is unstable without finite capacity.");
    }
    // Calculate the time of the first balk (t1)
    let t1 = 0;
    while (Math.floor(arrivalRate * t1) - Math.floor(serviceRate * t1 - serviceRate / arrivalRate) < capacity) {
      t1 += 0.01; // Increment by a small value for trial-and-error
    }
    t1 = parseFloat(t1.toFixed(2)); // Round to 2 decimal places for simplicity
    return { t1 };
  }
}