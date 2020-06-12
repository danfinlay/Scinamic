import nameGen from './nameGen.js';

export interface UnitType {
  name: string;
}

export default function generateUnit (): UnitType {
  return {
    name: nameGen(),
  }
}
