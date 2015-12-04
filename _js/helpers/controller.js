'use strict';

export const deadzone = (number, treshold) => {
  let percentage = (Math.abs(number) - treshold) / (1 - treshold);
  if(percentage < 0) percentage = 0;
  return percentage * (number > 0 ? 1 : -1);
};
