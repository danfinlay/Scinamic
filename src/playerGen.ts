import nameGen from './nameGen.js';
import { Resource } from './resourceGen.ts'

type Players = { [key: string]: Player }

interface Player {
  name: string;
  resources: { [ key:string ]: OwnedResource };
}

type OwnedResource = {
  amount: number,
}

export default function generatePlayers ({ resources, playerCount = 1 }: {resources: {}, playerCount?: number} = { resources: {}, playerCount: 1 }) {

  const players: Players = {};

  for (let i = 0; i < playerCount; i++) {
    const ownedResources: { [key: string]: OwnedResource } = {}
    for (let resource in resources) {
      ownedResources[resource] = { amount: 100 }
    }

    const player = {
      resources: ownedResources,
      name: nameGen(),
    }
    console.log('adding ', player)
    players[player.name] = player
  }

  return players
}
