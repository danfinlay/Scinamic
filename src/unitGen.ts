import nameGen from './nameGen.js';
import { Cost } from './types.ts';
import { Resource } from './resourceGen.ts';

export interface UnitType {
  name: string;
  cost: Cost;
}

export default function generateUnit ({
  resources = {}
}: {
  resources: { [key:string]: Resource }
} = {
  resources: {}
}): UnitType {

  const cost: Cost = {};
  Object.keys(resources).forEach((resourceKey: string) => {
    cost[resourceKey] = 50;
  })

  return {
    name: nameGen(),
    cost,
  }
}
