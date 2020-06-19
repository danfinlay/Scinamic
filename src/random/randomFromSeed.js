"use strict";
exports.__esModule = true;
exports.createRandomGen = exports.mixWithSeed = exports.randomFromSeed = void 0;
var ripemd160_1 = require("ripemd160");
/*
 * Takes a long hexadecimal string and converts it to a number from 0 to 1.
 *
 * Initial version is being hacked together, I'm not claiming thi sis secure.
 */
var hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
function randomFromSeed(seed) {
    var num = 0;
    for (var i = 0; i < seed.length; i++) {
        var fraction = hexChars.indexOf(seed[i]) / 16;
        var weight = Math.pow(10, -1 * i);
        // console.log(`Adding ${fraction} * ${weight}`)
        num += fraction * weight;
    }
    return num;
}
exports.randomFromSeed = randomFromSeed;
function mixWithSeed(seed, newval) {
    var seedHash = ripemd160_1["default"](seed + newval);
    return seedHash;
}
exports.mixWithSeed = mixWithSeed;
function createRandomGen(seed) {
    var nonce = 0;
    return function () {
        var newSeed = mixWithSeed(seed, String(nonce));
        nonce++;
        return randomFromSeed(newSeed);
    };
}
exports.createRandomGen = createRandomGen;
