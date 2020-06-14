import nameGen from './nameGen.js';
import { Resource, Resources } from './resourceGen.ts';
import unitGen, { Unit, UnitType } from './unitGen.ts';

type Players = { [key: string]: Player }

export interface Player {
  name: string;
  resources: { [ key:string ]: OwnedResource };
  units: Unit[];
  baseType: UnitType,
  build: (unit: UnitType) => Promise<Unit>;
}

type OwnedResource = {
  amount: number,
}

export default function generatePlayers ({
  resources, baseType, playerCount = 1
}: {
  resources: Resources,
  playerCount?: number,
  baseType: UnitType,
} = {
  resources: {}, playerCount: 1, baseType: { name: 'default', cost: {}, time:0, actions:[] },
}) {

  const players: Players = {};

  for (let i = 0; i < playerCount; i++) {
    const player = generatePlayer(resources, baseType);
    players[player.name] = player;
  }

  return players
}

function generatePlayer (resources: Resources, baseType: UnitType) {
  const ownedResources: { [key: string]: OwnedResource } = {}
  for (let resource in resources) {
    ownedResources[resource] = { amount: 100 }
  }

  const player: Player = {
    resources: ownedResources,
    units: [],
    name: nameGen(),
    baseType,
    build,
  }

  async function build (unitType: UnitType): Promise<Unit> {

    // Ensure prereqs are met:
    if (unitType.prereqs) {
      let disqualified = false;
      const currentTypes = player.units.map(b => b.instanceOf)

      unitType.prereqs.forEach((prereq) => {
        if (!currentTypes.includes(prereq)) {
          disqualified = true;
          return;
        }
      })

      if (disqualified) {
        throw new Error(`Unit ${unitType.name} requires ${unitType.prereqs.join(', ')}`)
      }
    }

    // Ensure user has required funds:
    let sufficientFunds = true;
    for (let resource in unitType.cost) {
      if (player.resources[resource].amount < unitType.cost[resource]) {
        throw new Error(`Insufficient ${resource}`);
      }
    }

    // Deduct the balance from the user:
    for (let resource in unitType.cost) {
      player.resources[resource].amount -= unitType.cost[resource];
    }

    const now = Date.now();
    const unit: Unit = {
      instanceOf: unitType,
      owner: player,
      date: {
        started: now,
        created: now + unitType.time,
      }  
    }

    return unit;
  }

  return player;
}

