import startGame from './index.js';
import builders from 'https://cdn.jsdelivr.net/npm/webscript@0.2.0/dist/webscript.esm.js'
import createElement from 'https://cdn.jsdelivr.net/npm/webscript@0.2.0/dist/createDOMElement.esm.js'
const { body, div, p, span, img } = builders(createElement);

const initialState = startGame();
const { players } = initialState;

const player = players['Player 1'];
console.log(printResources(player));
console.log(`Units: `, player.units);

window.addEventListener('load', render);

function render () {
  const content = document.querySelector('#content');
  const resources = buildResources(player);
  content.appendChild(resources);
}

function printResources (player) {
  let output = 'Resources: ';
  for (let resource in player.resources) {
    output += `${resource}: ${player.resources[resource].amount}. `
  }
  return output;
}

function buildResources (player) {
  const resources = [];
  for (let resource in player.resources) {
    resources.push(buildResource(resource, player.resources[resource].amount));
  }

  return div.class`resources`(...resources);
}

function buildResource (name, amount) {
  return div.class`resource`(
    span.class`label`(`${name}: `),
    span.class`value`(`${amount}`),
  )
}

