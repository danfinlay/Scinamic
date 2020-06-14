import { createRandomGen, RandomGen } from './random/randomFromSeed.ts';

const consonants = ['bl', 'gr', 'fr', 'kl', 'r', 'm']
const vowels = ['a', 'e', 'ei', 'o', 'u', 'ou', 'i']

export default function nameGen(syllables = 3, seed = 'default') {
  let name = ''
  const random = createRandomGen(seed);
  const vowelFirst = random() > 0.5;

  for (let i = 0; i < syllables * 2; i++) {
    const isVowel = ( i % 2 === 0 ) ? vowelFirst : !vowelFirst
    name += isVowel? pickVowel(random) : pickConsonant(random);
  }

  return name;
}

function pickSegment (list: string[], random: RandomGen) {
  const rand = random()
  return list[ Math.floor(list.length * rand)]
}

function pickVowel (random: RandomGen) {
  return pickSegment(vowels, random)
}

function pickConsonant (random: RandomGen) {
  return pickSegment(consonants, random)
}
