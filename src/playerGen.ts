import nameGen from './nameGen.ts';
import { Resource, Resources } from './resourceGen.ts';
import unitGen, { Unit, UnitType, UnitAction, createUnit } from './unitGen.ts';

type Players = { [key: string]: Player }

export interface Player {
  name: string;
  resources: { [ key:string ]: OwnedResource };
  units: Unit[];
  baseType: UnitType,
  build: (action: UnitAction) => Promise<Unit>;
}

type OwnedResource = {
  amount: number,
}

export default function generatePlayers ({
  resources, baseType, playerCount, seed,
}: {
  resources: Resources,
  playerCount: number,
  baseType: UnitType,
  seed: string,
} = {
  resources: {}, playerCount: 1, baseType: { name: 'default', cost: {}, time:0 }, seed: 'default-players',
}) {

  const players: Players = {};

  for (let i = 0; i < playerCount; i++) {
    const player = generatePlayer(resources, baseType, `Player ${i+1}`, seed);
    players[player.name] = player;
  }

  return players
}

function generatePlayer (resources: Resources, baseType: UnitType, name:string, seed: string) {
  const ownedResources: { [key: string]: OwnedResource } = {}
  for (let resource in resources) {
    ownedResources[resource] = { amount: 100 }
  }

  const player: Player = {
    name,
    resources: ownedResources,
    units: [],
    baseType,
    build,
  }
  player.units.push(generate(baseType, `${seed}-base-unit`));

  /**
   * The player-restricted method of spending resources to produce a unit.
   * @param action The action the player chooses to perform.
   */
  async function build (action: UnitAction): Promise<Unit> {

    // Ensure user has required funds:
    let sufficientFunds = true;
    for (let resource in action.cost) {
      if (player.resources[resource].amount < action.cost[resource]) {
        throw new Error(`Insufficient ${resource}`);
      }
    }

    // Deduct the balance from the user:
    for (let resource in action.cost) {
      player.resources[resource].amount -= action.cost[resource];
    }

    return generate(action.unitProduced, action.seed);
  }

  /**
   * The unsafe way of generating a unit for a player.
   * Should only be used internally.
   * @param action The unit to pre-generate.
   */
  function generate (unitType: UnitType, seed: string): Unit {
    const unit: Unit = createUnit({
      unitType,
      seed,
      player,
      resources,
    })

    player.units.push(unit);
    return unit;
  }




  return player;
}

