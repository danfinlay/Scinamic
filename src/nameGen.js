"use strict";
exports.__esModule = true;
var randomFromSeed_1 = require("./random/randomFromSeed");
var consonants = ['bl', 'gr', 'fr', 'kl', 'r', 'm'];
var vowels = ['a', 'e', 'ei', 'o', 'u', 'ou', 'i'];
function nameGen(syllables, seed) {
    if (syllables === void 0) { syllables = 3; }
    if (seed === void 0) { seed = 'default'; }
    var name = '';
    var random = randomFromSeed_1.createRandomGen(seed);
    var vowelFirst = random() > 0.5;
    for (var i = 0; i < syllables * 2; i++) {
        var isVowel = (i % 2 === 0) ? vowelFirst : !vowelFirst;
        name += isVowel ? pickVowel(random) : pickConsonant(random);
    }
    return name;
}
exports["default"] = nameGen;
function pickSegment(list, random) {
    var rand = random();
    return list[Math.floor(list.length * rand)];
}
function pickVowel(random) {
    return pickSegment(vowels, random);
}
function pickConsonant(random) {
    return pickSegment(consonants, random);
}
