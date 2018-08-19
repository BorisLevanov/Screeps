var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFixer = require('role.fixer');
var towers = require('towers')

module.exports.loop = function() {
    var harvesterCounter = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

    /**
     * Spawns screeps based on requested type and level
     * @param {*} screepType 
     * @param {*} screepLimit 
     * @param {*} screepLevel 
     */
    function spawnScreep(screepType, screepLimit, screepLevel) {
        var bodySize
        switch (screepLevel) {
            case 2:
                bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
                break;
            default:
                bodySize = [WORK, CARRY, MOVE];
        }
        var screepCounter = _.filter(Game.creeps, (creep) => creep.memory.role == screepType);
        if (screepCounter.length < screepLimit) {
            var screepName = screepType + Game.time;
            console.log('Spawning new ' + screepType + ': ' + screepName);
            Game.spawns['Base01'].spawnCreep(bodySize, screepName, { memory: { role: screepType } });
        }
    }

    // Memory cleaner
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    towers.tick()



    spawnScreep('harvester', 4, 2)
        // Emergency Harvester spawn limit
    if (harvesterCounter.length >= 3) {
        // The rest of spawns
        spawnScreep('fixer', 2, 2)
        spawnScreep('upgrader', 6, 2)
        spawnScreep('builder', 2, 2)
    }


    if (Game.spawns['Base01'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Base01'].spawning.name];
        Game.spawns['Base01'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Base01'].pos.x + 1,
            Game.spawns['Base01'].pos.y, { align: 'left', opacity: 0.8 });
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'fixer':
                roleFixer.run(creep);
                break;
        }
    }
}