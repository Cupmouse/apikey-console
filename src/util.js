import BigNumber from "bignumber.js";

const SI_SUFFIX = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export const humanReadableBytes = (bytes) => {
  let siIndex = 0;
  let numPart = bytes;
  for (; siIndex < SI_SUFFIX.length && numPart.gte(1024); siIndex += 1) {
    numPart = numPart.dividedToIntegerBy(1024); // 1024 = 2^10
  }

  // const rounded = Math.round(numPart * 100) / 100;
  return `${numPart} ${SI_SUFFIX[siIndex]}`;
};

export const ensureUTCDate = (date) => new Date(Date.UTC(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
  date.getSeconds(),
));

export const getCustomerKey = () => {
  const customerKeyStr = localStorage.getItem('customerKey');
  if (customerKeyStr !== null) {
    return BigNumber(customerKeyStr);
  }
  return null;
};
