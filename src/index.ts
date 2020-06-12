import nameGen from './nameGen.js'
import resourceGen from './resourceGen.ts';
import playerGen from './playerGen.ts';

const resources = resourceGen();
const players = playerGen({ resources });

const initialState = {
  resources,
  players,
}

console.log(`Starting with: ${JSON.stringify(initialState, null, 2)}`)
