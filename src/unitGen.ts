import nameGen from './nameGen.ts';
import { Cost } from './types.ts';
import { Resource, Resources } from './resourceGen.ts';
import { Player } from './playerGen.ts';

export interface Unit {
  instanceOf: UnitType;
  owner: Player,
  date: {
    started: number;
    created: number;
  };
}

export interface UnitType {
  name: string;
  cost: Cost;
  time: number; // in ms
  actions: Array<UnitAction>;
  prereqs?: UnitType[];
}

export interface UnitAction {
  name: string;
  cost: Cost;
  time: number; // in ms
  seed: string;
  unitProduced?: UnitType;
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

  const cost: Cost = {};
  Object.keys(resources).forEach((resourceKey: string) => {
    cost[resourceKey] = 50;
  })

  const actions = [];
  for (let i = 0; i < 3; i++) {
    actions.push(generateAction({ resources, seed: `${seed}action${i}` }));
  }

  return {
    name: nameGen(3, `${seed}unit`),
    cost,
    time: 30,
    actions,
  }
}

function generateAction ({ resources, seed }: { resources: Resources, seed: string } = { resources: {}, seed: 'default-action' }): UnitAction {

  const cost: Cost = {};
  Object.keys(resources).forEach((resourceKey: string) => {
    cost[resourceKey] = 30;
  })

  const action: UnitAction = {
    name: nameGen(),
    cost,
    time: 30000, // 30 seconds
    seed,
  };

  return action;
}
