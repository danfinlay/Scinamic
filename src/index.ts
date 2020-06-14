import nameGen from './nameGen.js'
import resourceGen from './resourceGen.ts';
import { Resources } from './resourceGen.ts';
import playerGen from './playerGen.ts';
import unitGen, { Unit, UnitType } from './unitGen.ts';
import ripemd160 from "https://raw.githubusercontent.com/paulmillr/noble-ripemd160/master/index.ts";
import randomFromSeed from './random/randomFromSeed.ts';

const randomSeed: number = Math.round(Math.random() * 100000000000);
const seedHash = ripemd160(String(randomSeed));

const resources: Resources = resourceGen();

const baseType: UnitType = unitGen({ resources });

const players = playerGen({ resources, baseType, playerCount: 1 });

const initialState = {
  resources,
  baseType,
  players,
}

console.log(`Starting with: ${JSON.stringify(initialState, null, 2)}`)
