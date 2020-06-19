"use strict";
exports.__esModule = true;
var nameGen_1 = require("./nameGen");
function generateResources(seed) {
    if (seed === void 0) { seed = 'default'; }
    var resources = {};
    for (var i = 0; i < 3; i++) {
        var resource = {
            name: nameGen_1["default"](1, seed + " resource " + i)
        };
        resources[resource.name] = resource;
    }
    return resources;
}
exports["default"] = generateResources;
