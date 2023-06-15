export const roundToNearestDouble = (value: number) => {
  return Number(value.toFixed(2));
};

export const formatNumber = (arg: number): string => {
  return new Intl.NumberFormat("en-US").format(arg);
};
