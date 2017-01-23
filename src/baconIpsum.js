function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const baconIpsum = [
  'Bacon ipsum dolor amet chicken chuck turkey',
  'Drumstick kevin t-bone hamburger tenderloin landjaeger.',
  'Ham porchetta bacon tongue turducken short loin tail pork loin.',
  'Chicken jowl prosciutto kielbasa',
  'Spare ribs salami cow pastrami.'
];

export const getBacon = () => baconIpsum[getRandomInt(0, baconIpsum.length)];
