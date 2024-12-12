export const getFromLocalStorage = (
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: any = "",
  parse?: boolean
) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    if (saved) {
      return parse ? parseInt(saved) : saved;
    }
    return defaultValue;
  }
  return defaultValue;
};
