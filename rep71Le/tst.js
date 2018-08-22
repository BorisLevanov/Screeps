    var blah = 'blah'
        /**
         * Spawns screeps based on requested type and limit
         * @param {String} screepType - type of screep, i.e. screepType
         * @param {String} screepLimit - how many Screeps to spawn
         */
    function spawnScreep(screepType, screepLimit) {
        var screepCounter = _.filter(Game.creeps, (creep) => creep.memory.role == screepType);
        if (screepCounter.length < screepLimit) {
            var screepName = screepType + Game.time;
            console.log('Spawning new ' + screepType + ': ' + screepName);
            Game.spawns['Base01'].spawnCreep([WORK, CARRY, MOVE], screepName, { memory: { role: screepType } });
        }
    }

    spawnScreep(screepType, 4, 2)