import nameGen from './nameGen.js';
import { Resource, Resources } from './resourceGen.ts';
import { Building, BuildingType } from './buildingGen.ts';

type Players = { [key: string]: Player }

export interface Player {
  name: string;
  resources: { [ key:string ]: OwnedResource };
  buildings: Building[];
  buildingTypes: Array<BuildingType>;
  build: (building: BuildingType) => Promise<Building>;
}

type OwnedResource = {
  amount: number,
}

export default function generatePlayers ({
  resources, buildingTypes, playerCount = 1
}: {
  resources: Resources,
  playerCount?: number,
  buildingTypes: BuildingType[],
} = {
  resources: {}, playerCount: 1, buildingTypes: [],
}) {

  const players: Players = {};

  for (let i = 0; i < playerCount; i++) {
    const player = generatePlayer(resources, buildingTypes);
    players[player.name] = player;
  }

  return players
}

function generatePlayer (resources: Resources, buildingTypes: BuildingType[]) {
  const ownedResources: { [key: string]: OwnedResource } = {}
  for (let resource in resources) {
    ownedResources[resource] = { amount: 100 }
  }

  const player: Player = {
    resources: ownedResources,
    buildings: [],
    name: nameGen(),
    buildingTypes: buildingTypes,
    build,
  }

  async function build (buildingType: BuildingType): Promise<Building> {

    // Ensure prereqs are met:
    if (buildingType.prereqs) {
      let disqualified = false;
      const currentTypes = player.buildings.map(b => b.instanceOf)

      buildingType.prereqs.forEach((prereq) => {
        if (!currentTypes.includes(prereq)) {
          disqualified = true;
          return;
        }
      })

      if (disqualified) {
        throw new Error(`Building ${buildingType.name} requires ${buildingType.prereqs.join(', ')}`)
      }
    }

    // Ensure user has required funds:
    let sufficientFunds = true;
    for (let resource in buildingType.cost) {
      if (player.resources[resource].amount < buildingType.cost[resource]) {
        throw new Error(`Insufficient ${resource}`);
      }
    }

    // Deduct the balance from the user:
    for (let resource in buildingType.cost) {
      player.resources[resource].amount -= buildingType.cost[resource];
    }

    const now = Date.now();
    const building: Building = {
      instanceOf: buildingType,
      owner: player,
      date: {
        startedBuilding: now,
        created: now + buildingType.time,
      }  
    }

    return building;
  }

  return player;
}

