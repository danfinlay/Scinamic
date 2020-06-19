"use strict";
exports.__esModule = true;
var resourceGen_1 = require("./resourceGen");
var playerGen_1 = require("./playerGen");
var unitGen_1 = require("./unitGen");
var caputi_1 = require("caputi");
var obs = caputi_1.observable(1);
console.log(obs);
var randomSeed = Math.round(Math.random() * 100000000000);
var seedHash = 'abcdef0123456789';
var resources = resourceGen_1["default"](seedHash);
var baseType = unitGen_1["default"]({ resources: resources, seed: seedHash });
var players = playerGen_1["default"]({ resources: resources, baseType: baseType, playerCount: 1, seed: seedHash });
var initialState = {
    resources: resources,
    baseType: baseType,
    players: players
};
var player = players['Player 1'];
console.log(printResources(player));
console.log("Units: ", player.units);
debugger;
function printResources(player) {
    var output = 'Resources: ';
    for (var resource in player.resources) {
        output += resource + ": " + player.resources[resource].amount + ". ";
    }
    return output;
}
