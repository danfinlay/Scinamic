import randomFromSeed from './randomFromSeed.ts';
import { assert } from "https://deno.land/std/testing/asserts.ts";

Deno.test('high random input', () => {
  const input1 = 'fffffffff';
  const output1 = randomFromSeed(input1);
  assert(output1 > 0.99, 'outputs a high value');
})

Deno.test('zero random input', () => {
  const input2 = '000000000';
  const output2 = randomFromSeed(input2);
  assert(output2 === 0, 'hex zero input equals zero');
})

Deno.test('half random input', () => {
  const input3 = '800000';
  const output3 = randomFromSeed(input3);
  assert(output3 === 0.5, 'hex 8000 is one half');
})
