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



// utils/localstorage.ts
// export const getFromLocalStorage = (key: string, defaultValue: string | null = null): string => {
//   if (typeof window === 'undefined') return defaultValue || '';
  
//   const value = localStorage.getItem(key);
//   return value !== null ? value : (defaultValue || '');
// };

export const saveToLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  
  if (value === '') {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
};