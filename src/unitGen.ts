import nameGen from './nameGen.js';
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
  unitProduced?: UnitType;
}

export default function generateUnit ({
  resources = {}
}: {
  resources: Resources,
} = {
  resources: {}
}): UnitType {

  const cost: Cost = {};
  Object.keys(resources).forEach((resourceKey: string) => {
    cost[resourceKey] = 50;
  })

  const actions = [];
  for (let i = 0; i < 3; i++) {
    actions.push(generateAction({ resources }));
  }

  return {
    name: nameGen(),
    cost,
    time: 30,
    actions,
  }
}

function generateAction ({ resources = {} }: { resources: Resources } = { resources: {} }): UnitAction {

  const cost: Cost = {};
  Object.keys(resources).forEach((resourceKey: string) => {
    cost[resourceKey] = 30;
  })

  const action: UnitAction = {
    name: nameGen(),
    cost,
    time: 30000, // 30 seconds
    unitProduced: generateUnit(),
  };

  return action;
}
