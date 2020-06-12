import nameGen from './nameGen.js'
import resourceGen from './resourceGen.ts';

const initialOptions = {
  resources: resourceGen(),
}

console.log(`Starting with: ${JSON.stringify(initialOptions)}`)
