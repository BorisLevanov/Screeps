module.exports.loop = function() {

    const thisSpawn = 'Base01'

    Game.spawns[thisSpawn].room.memory.yellowAlert = false
    var harvesterCounter = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

    // Run towers
    require('towers').tick()

    /**
     * Spawns screeps based on requested type and limit
     * @param {String} screepType - type of screep, i.e. screepType
     * @param {Integer} screepLimit - how many Screeps to spawn
     * @param {Integer} screepLevel - body identifier
     */
    function spawnScreep(screepType, screepLimit, screepLevel) {
        var bodySize

        switch (screepType + '|' + screepLevel.toString()) {
            case 'zaslanec|1':
                bodySize = [CLAIM, MOVE];
                break;

            case 'tanchik|1':
                bodySize = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE];
                break;

            case 'harvester|3':
                bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
                break;

            case 'upgrader|3':
            case 'fixer|3':
            case 'builder|3':
                bodySize = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                break;

            default:
                bodySize = [WORK, CARRY, MOVE];
                break;
        }

        var screepCounter = _.filter(Game.creeps, (creep) => creep.memory.role == screepType);
        if (screepCounter.length < screepLimit) {
            var screepName = screepType + Game.time;
            console.log('Spawning new ' + screepType + ': ' + screepName);
            Game.spawns[thisSpawn].spawnCreep(bodySize, screepName, { memory: { role: screepType } });
        }
    }


    // Spawn harvesters as priority
    spawnScreep('harvester', 3, 3)
        // Do not spawn anything else until 3 harvesters exist
    if (harvesterCounter.length >= 3) {
        // If there's enough harvesters, spawn other units
        spawnScreep('fixer', 2, 3)
        spawnScreep('upgrader', 3, 3)
        spawnScreep('builder', 1, 3)
            //spawnScreep('zaslanec', 1, 1)
            //if (Game.spawns[thisSpawn].room.memory.yellowAlert == true) {
            spawnScreep('tanchik', 1, 1)
            //}
    }





    // Creep spawner
    if (Game.spawns[thisSpawn].spawning) {
        var spawningCreep = Game.creeps[Game.spawns[thisSpawn].spawning.name];
        Game.spawns[thisSpawn].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[thisSpawn].pos.x + 1,
            Game.spawns[thisSpawn].pos.y, { align: 'left', opacity: 0.8 });
    }


    // Creep runner
    for (var name in Game.creeps) {
        var thisCreep = Game.creeps[name],
            creepIdentifier = require('role.' + Game.creeps[name].memory.role);
        creepIdentifier.run(thisCreep)
    }

}