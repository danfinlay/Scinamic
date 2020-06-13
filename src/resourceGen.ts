import nameGen from './nameGen.js';

export type Resources = { [key: string]: Resource }

export interface Resource {
  name: string;
}

export default function generateResources () {
  const resources: Resources = {};

  for (let i = 0; i < 3; i++) {
    const resource = {
      name: nameGen(1),
    }
    console.log('adding ', resource)
    resources[resource.name] = resource
  }

  return resources
}
