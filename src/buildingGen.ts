import nameGen from './nameGen.js';
import { Cost } from './types.ts';
import { UnitType } from './unitGen.ts';
import generateUnit from './unitGen.ts';

export interface Building {
  instanceOf: BuildingType;
}

export interface BuildingType {
  name: string;
  cost: Cost;
  actions: Array<BuildingAction>;
}

export interface BuildingAction {
  cost: Cost;
  time: number; // in ms
  type: 'research' | 'training';
  unitProduced?: UnitType;
}

const actionTypes = ['research', 'training'];
function chooseActionType () {
  return actionTypes[ Math.floor( Math.random() * actionTypes.length ) ]
}

export default function buildingGen (opts = {}): () => BuildingType[] {
  const buildings: BuildingType[] = [];

  for (let i = 0; i < 3; i++) {

    const cost = {};

    const building: BuildingType = {
      name: nameGen(),
      actions: [],
      cost,
    };

    for (let x = 0; x < 3; x++) {
      const action: BuildingAction = {
        
      };
      building.actions.push(action);
    }
  }

  return buildings;
}
