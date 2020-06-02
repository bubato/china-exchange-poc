// eslint-disable-next-line import/prefer-default-export
export const toCurrency = number => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY"
  })
    .format(number)
    .replace(/^(\D+)/, "$1 ")
    .replace(/\D00$/, "");
};
