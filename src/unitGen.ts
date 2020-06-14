import nameGen from './nameGen.ts';
import { createRandomGen, RandomGen } from './random/randomFromSeed.ts';
import { Cost } from './types.ts';
import { Resource, Resources } from './resourceGen.ts';
import generatePlayers, { Player } from './playerGen.ts';

export interface Unit {
  instanceOf: UnitType;
  owner: Player,
  actions: Array<UnitAction>;
  date: {
    started: number;
    created: number | undefined;
  };
}

export interface UnitType {
  name: string;
  cost: Cost;
  time: number; // in ms
  prereqs?: UnitType[];
}

export interface UnitAction {
  name: string;
  cost: Cost;
  time: number; // in ms
  seed: string;
  unitProduced: UnitType;
}

export default function generateUnit ({
  resources,
  seed,
}: {
  resources: Resources,
  seed: string,
} = {
  resources: {},
  seed: 'default-unit',
}): UnitType {
  const random: RandomGen = createRandomGen(`${seed}-unit`)

  const cost: Cost = {};
  Object.keys(resources).forEach((resourceKey: string) => {
    cost[resourceKey] = 50;
  })
  return {
    name: nameGen(3, `${seed}-unit-${random()}`),
    cost,
    time: 30,
  }
}

export function createUnit ({
  unitType,
  seed,
  player,
  resources,
}:{
  seed: string,
  unitType: UnitType,
  player: Player,
  resources: Resources,
}): Unit {
  if (!player) {
    throw new Error('must include a player to create a unit')
  }

  const random: RandomGen = createRandomGen(`${seed}-unit`)

  const actions = [];
  const actionCount: number = Math.ceil( random() * 3 )
  for (let i = 0; i < actionCount; i++) {
    actions.push(generateAction({ resources, seed: `${seed}action${i}` }));
  }

  const unit: Unit = {
    instanceOf: unitType,
    owner: player, 
    actions,
    date: {
      started: Date.now(),
      created: undefined,
    }
  }
  return unit;
}

function generateAction ({ resources, seed }: { resources: Resources, seed: string } = { resources: {}, seed: 'default-action' }): UnitAction {

  const cost: Cost = {};
  Object.keys(resources).forEach((resourceKey: string) => {
    cost[resourceKey] = 30;
  })

  const name = nameGen(3, seed);
  const action: UnitAction = {
    name,
    cost,
    time: 30000, // 30 seconds
    seed,
    unitProduced: generateUnit({ resources, seed: `${seed}:action:${name}` }),
  };

  return action;
}
