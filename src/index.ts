import resourceGen from './resourceGen.ts';
import { Resources } from './resourceGen.ts';
import playerGen, { Player } from './playerGen.ts';
import unitGen, { Unit, UnitType } from './unitGen.ts';
import ripemd160 from "https://raw.githubusercontent.com/paulmillr/noble-ripemd160/master/index.ts";
import { randomFromSeed } from './random/randomFromSeed.ts';

const randomSeed: number = Math.round(Math.random() * 100000000000);
const seedHash = ripemd160(String(randomSeed));

const resources: Resources = resourceGen(seedHash);

const baseType: UnitType = unitGen({ resources, seed: seedHash });

const players = playerGen({ resources, baseType, playerCount: 1, seed: seedHash });

const initialState = {
  resources,
  baseType,
  players,
}

const player: Player = players['Player 1'];
console.log(printResources(player));
console.log(`Units: `, player.units);

debugger;

function printResources (player: Player) {
  let output = 'Resources: ';
  for (let resource in player.resources) {
    output += `${resource}: ${player.resources[resource].amount}. `
  }
  return output;
}

