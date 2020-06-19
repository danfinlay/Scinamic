"use strict";
exports.__esModule = true;
exports.createUnit = void 0;
var nameGen_1 = require("./nameGen");
var randomFromSeed_1 = require("./random/randomFromSeed");
function generateUnit(_a) {
    var _b = _a === void 0 ? {
        resources: {},
        seed: 'default-unit'
    } : _a, resources = _b.resources, seed = _b.seed;
    var random = randomFromSeed_1.createRandomGen(seed + "-unit");
    var cost = {};
    Object.keys(resources).forEach(function (resourceKey) {
        cost[resourceKey] = 50;
    });
    return {
        name: nameGen_1["default"](3, seed + "-unit-" + random()),
        cost: cost,
        time: 30
    };
}
exports["default"] = generateUnit;
function createUnit(_a) {
    var unitType = _a.unitType, seed = _a.seed, player = _a.player, resources = _a.resources;
    if (!player) {
        throw new Error('must include a player to create a unit');
    }
    var random = randomFromSeed_1.createRandomGen(seed + "-unit");
    var actions = [];
    var actionCount = Math.ceil(random() * 3);
    for (var i = 0; i < actionCount; i++) {
        actions.push(generateAction({ resources: resources, seed: seed + "action" + i }));
    }
    var unit = {
        instanceOf: unitType,
        owner: player,
        actions: actions,
        date: {
            started: Date.now(),
            created: undefined,
            onCompletion: onCompletion
        }
    };
    var completed = false;
    var completionPromise = new Promise(function (res) {
        setTimeout(function () {
            res(unit);
        }, unitType.time);
    });
    function onCompletion() {
        return completionPromise;
    }
    return unit;
}
exports.createUnit = createUnit;
function generateAction(_a) {
    var _b = _a === void 0 ? { resources: {}, seed: 'default-action' } : _a, resources = _b.resources, seed = _b.seed;
    var cost = {};
    Object.keys(resources).forEach(function (resourceKey) {
        cost[resourceKey] = 30;
    });
    var name = nameGen_1["default"](3, seed);
    var action = {
        name: name,
        cost: cost,
        time: 30000,
        seed: seed,
        unitProduced: generateUnit({ resources: resources, seed: seed + ":action:" + name })
    };
    return action;
}
