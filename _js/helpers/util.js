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

export const lightenColor = (color, percent) => {
  let num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;

  return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};
