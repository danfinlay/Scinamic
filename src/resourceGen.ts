import nameGen from './nameGen';

export type Resources = { [key: string]: Resource }

export interface Resource {
  name: string;
}

export default function generateResources (seed: string = 'default') {
  const resources: Resources = {};

  for (let i = 0; i < 3; i++) {
    const resource = {
      name: nameGen(1, `${seed} resource ${i}`),
    }
    resources[resource.name] = resource
  }

  return resources
}
