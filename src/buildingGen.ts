import nameGen from './nameGen.js';
import { Resource, Resources } from './resourceGen.ts';
import { Cost } from './types.ts';
import { UnitType } from './unitGen.ts';
import { Player } from './playerGen.ts';
import generateUnit from './unitGen.ts';

export interface Building {
  instanceOf: BuildingType;
  owner: Player,
  date: {
    startedBuilding: number;
    created: number;
  };
}

export interface BuildingType {
  name: string;
  cost: Cost;
  time: number; // in ms
  actions: Array<BuildingAction>;
  prereqs?: BuildingType[];
}

export interface BuildingAction {
  name: string;
  cost: Cost;
  time: number; // in ms
  type: actionType;
  unitProduced?: UnitType;
}

type actionType = 'research' | 'training';
const actionTypes: actionType[] = ['research', 'training'];
function chooseActionType () {
  return actionTypes[ Math.floor( Math.random() * actionTypes.length ) ]
}

export default function buildingGen ({
  resources,
}: {
  resources: Resources,
} = {
  resources: {},
}): BuildingType[] {
  const buildings: BuildingType[] = [];

  for (let i = 0; i < 3; i++) {

    const cost: Cost = {};
    Object.keys(resources).forEach((resourceKey: string) => {
      cost[resourceKey] = 50;
    })

    const building: BuildingType = {
      name: nameGen(),
      time: 30000, // 30 seconds
      actions: [],
      cost,
    };

    for (let x = 0; x < 3; x++) {
      const type: actionType = actionTypes[Math.round(Math.random())];

      const cost: Cost = {};
      Object.keys(resources).forEach((resourceKey: string) => {
        cost[resourceKey] = type === 'research' ? 50 : 20;
      })

      const action: BuildingAction = {
        type,
        name: nameGen(),
        cost,
        time: 30000, // 30 seconds
      };

      if (type === 'training') {
        action.unitProduced = generateUnit();
      }

      building.actions.push(action);
    }
    console.log('a building', building)
    buildings.push(building);
  }

  return buildings;
}