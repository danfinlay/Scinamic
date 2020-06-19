import nameGen from './nameGen';
import { createRandomGen, RandomGen } from './random/randomFromSeed';
import { Cost } from './types';
import { Resource, Resources } from './resourceGen';
import generatePlayers, { Player } from './playerGen';

export interface Unit {
  instanceOf: UnitType;
  owner: Player,
  actions: Array<UnitAction>;
  date: {
    started: number;
    created: number | undefined;
    onCompletion: () => Promise<Unit>;
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
      onCompletion,
    }
  }

  let completed = false;
  const completionPromise: Promise<Unit> = new Promise((res) => {
    setTimeout(() => {
      res(unit);
    }, unitType.time);
  })
  function onCompletion () {
    return completionPromise;
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
