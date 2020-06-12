import nameGen from './nameGen.js';
import { Resource } from './resourceGen.ts';
import { Building, BuildingType } from './buildingGen.ts';

type Players = { [key: string]: Player }

interface Player {
  name: string;
  resources: { [ key:string ]: OwnedResource };
  buildings: Array<Building>;
  buildingTypes: Array<BuildingType>;
}

type OwnedResource = {
  amount: number,
}

export default function generatePlayers ({
  resources, buildingTypes, playerCount = 1
}: {
  resources: {},
  playerCount?: number,
  buildingTypes: BuildingType[],
} = {
  resources: {}, playerCount: 1, buildingTypes: [],
}) {

  const players: Players = {};

  for (let i = 0; i < playerCount; i++) {
    const ownedResources: { [key: string]: OwnedResource } = {}
    for (let resource in resources) {
      ownedResources[resource] = { amount: 100 }
    }

    const player = {
      resources: ownedResources,
      buildings: [],
      name: nameGen(),
      buildingTypes: buildingTypes,
    }
    console.log('adding ', player)
    players[player.name] = player
  }

  return players
}
