export const format = (n: string) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
