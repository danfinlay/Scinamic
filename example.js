import startGame from './index.js';

const initialState = startGame();
const { players } = initialState;

const player = players['Player 1'];
console.log(printResources(player));
console.log(`Units: `, player.units);

const container = document.querySelector('body');
render(player, container);

debugger;

function render(player, container) {
  const div = document.createElement('div');
  container.appendChild(div);
}

function printResources (player) {
  let output = 'Resources: ';
  for (let resource in player.resources) {
    output += `${resource}: ${player.resources[resource].amount}. `
  }
  return output;
}

