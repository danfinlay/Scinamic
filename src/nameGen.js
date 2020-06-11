const consonants = ['bl', 'gr', 'fr', 'kl', 'r', 'm']
const vowels = ['a', 'e', 'ei', 'o', 'u', 'ou', 'i']

function nameGen() {
  let name = ''
  const vowelFirst = Math.random() > 0.5;
  console.log('vowel first?' , vowelFirst)

  for (let i = 0; i < 6; i++) {
    const isVowel = ( i % 2 === 0 ) ? vowelFirst : !vowelFirst
    console.log(`Iteration ${i} is ${isVowel}`)
    name += isVowel? pickVowel() : pickConsonant()
    console.log(`Name is now ${name}`)
  }

  return name;
}

function pickSegment (list) {
  const rand = Math.random()
  console.log(`Random is ${rand} for list of length ${list.length}`)
  return list[ Math.floor(list.length * rand)]
}

function pickVowel () {
  return pickSegment(vowels)
}

function pickConsonant () {
  return pickSegment(consonants)
}

module.exports = nameGen;
