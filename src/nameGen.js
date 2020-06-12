const consonants = ['bl', 'gr', 'fr', 'kl', 'r', 'm']
const vowels = ['a', 'e', 'ei', 'o', 'u', 'ou', 'i']

export default function nameGen(syllables = 3) {
  let name = ''
  const vowelFirst = Math.random() > 0.5;

  for (let i = 0; i < syllables * 2; i++) {
    const isVowel = ( i % 2 === 0 ) ? vowelFirst : !vowelFirst
    name += isVowel? pickVowel() : pickConsonant()
  }

  return name;
}

function pickSegment (list) {
  const rand = Math.random()
  return list[ Math.floor(list.length * rand)]
}

function pickVowel () {
  return pickSegment(vowels)
}

function pickConsonant () {
  return pickSegment(consonants)
}
