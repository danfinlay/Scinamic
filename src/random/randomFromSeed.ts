import ripemd160 from "https://raw.githubusercontent.com/paulmillr/noble-ripemd160/master/index.ts";

/*
 * Takes a long hexadecimal string and converts it to a number from 0 to 1.
 *
 * Initial version is being hacked together, I'm not claiming thi sis secure.
 */
const hexChars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
export function randomFromSeed (seed: string): number {
  let num: number = 0;

  for (let i = 0; i < seed.length; i++) {
    const fraction = hexChars.indexOf(seed[i]) / 16;
    const weight = Math.pow(10, -1 * i)
    // console.log(`Adding ${fraction} * ${weight}`)
    num += fraction * weight;
  }

  return num;
}

export type RandomGen = () => number;

export function mixWithSeed (seed: string, newval: string): string {
  const seedHash = ripemd160(seed + newval);
  return seedHash
}

export function createRandomGen (seed: string): () => number {
  let nonce = 0;

  return (): number => {
    const newSeed = mixWithSeed(seed, String(nonce));
    nonce++;
    return randomFromSeed(newSeed); 
  }
}
