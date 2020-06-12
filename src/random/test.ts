import randomFromSeed from './randomFromSeed.ts';

const input1 = 'fffffffff';
const output1 = randomFromSeed(input1);
console.log(`Input ${input1} produces ${output1}`);

const input2 = '000000000';
const output2 = randomFromSeed(input2);
console.log(`Input ${input2} produces ${output2}`);

const input3 = '800000';
const output3 = randomFromSeed(input3);
console.log(`Input ${input3} produces ${output3}`);
