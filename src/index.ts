import resourceGen from './resourceGen';
import { Resources } from './resourceGen';
import playerGen, { Player } from './playerGen';
import unitGen, { UnitType } from './unitGen';


import { observable } from 'caputi';

const obs = observable(1);

console.log(obs);




const seedHash = 'abcdef0123456789';

const resources: Resources = resourceGen(seedHash);

const baseType: UnitType = unitGen({ resources, seed: seedHash });

const players = playerGen({ resources, baseType, playerCount: 1, seed: seedHash });

const initialState = {
  resources,
  baseType,
  players,
}

console.log(initialState);

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
