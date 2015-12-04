'use strict';

export const getRandomPoint = () => {
  return {
    x: randomBetween(-300, 300),
    y: randomBetween(10, 60),
    z: randomBetween(-300, 300)
  };
};

export const randomBetween = (min, max) => {
  let rand = min + Math.random() * (max-min);
  if(rand) rand = Math.round(rand);

  return rand;
};

export const getRandomColor = () => {
  let letters = '0123456789ABCDEF'.split('');
  let color = '0x';

  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};
