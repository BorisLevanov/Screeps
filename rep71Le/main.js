var actions = require('actions')

module.exports.loop = function() {

    var allBases = ['Base01', 'Base02']

    for (var creepMemo in Memory.creeps) {
        if (!Game.creeps[creepMemo]) {
            delete Memory.creeps[creepMemo];
            console.log('Clearing non-existing creep memory:', creepMemo);
        }
    }

    for (thisBase of allBases) {

        const thisSpawn = thisBase

        // Game.spawns[thisSpawn].room.memory.yellowAlert = false
        var harvestersPerRoom = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.homeRoom == thisSpawn)
            // console.log('Harvesters: ' + harvestersPerRoom.length)

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
                // console.log(thisSpawn + ':' + screepType)
                // console.log('Checking new ' + screepType + ': ')
            var screepCounter = _.filter(Game.creeps, (creep) => creep.memory.role == screepType && creep.memory.homeRoom == thisSpawn)
                // console.log(screepCounter.length + ' / ' + screepLimit)

            if (screepCounter.length < screepLimit) {
                switch (screepType + '|' + screepLevel.toString()) {
                    case 'zaslanec|1':
                        bodySize = [CLAIM, MOVE]
                        break

                    case 'tanchik|1':
                        bodySize = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE]
                        break

                    case 'harvester|2':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
                        break

                    case 'harvester|3':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
                        break

                    case 'upgrader|2':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
                        break

                    case 'fixer|2':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
                        break

                    case 'builder|2':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
                        break

                    case 'upgrader|3':
                    case 'fixer|3':
                    case 'builder|3':
                        bodySize = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
                        break

                    default:
                        bodySize = [WORK, CARRY, MOVE]
                        break
                }

                var screepName = screepType + Game.time
                console.log(thisSpawn + ' - Spawning new ' + screepType + ': ' + screepName)
                Game.spawns[thisSpawn].spawnCreep(bodySize, screepName, {
                    memory: {
                        role: screepType,
                        homeRoom: thisSpawn
                    }
                })


            }
        }

        switch (thisSpawn) {
            case 'Base01':
                // Spawn harvesters as priority
                spawnScreep('harvester', 3, 3)
                    // Do not spawn anything else until 3 harvesters exist
                if (harvestersPerRoom.length >= 3) {
                    // If there's enough harvesters, spawn other units
                    spawnScreep('fixer', 2, 3)
                    spawnScreep('upgrader', 3, 3)
                    spawnScreep('builder', 2, 3)
                        //spawnScreep('zaslanec', 1, 1)
                        //if (Game.spawns[thisSpawn].room.memory.yellowAlert == true) {
                    spawnScreep('tanchik', 1, 1)
                }
                break

            case 'Base02':

                spawnScreep('harvester', 3, 2)
                if (harvestersPerRoom.length >= 3) {
                    spawnScreep('fixer', 2, 2)
                    spawnScreep('upgrader', 2, 2)
                    spawnScreep('builder', 1, 2)
                    break
                }
        }




        // Creep spawner
        if (Game.spawns[thisSpawn].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[thisSpawn].spawning.name]
            Game.spawns[thisSpawn].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[thisSpawn].pos.x + 1,
                Game.spawns[thisSpawn].pos.y, { align: 'left', opacity: 0.8 })
        }


        // Creep runner
        for (var name in Game.creeps) {
            var thisCreep = Game.creeps[name],
                creepIdentifier = require('role.' + Game.creeps[name].memory.role)
            creepIdentifier.run(thisCreep, actions)
        }

    }
}