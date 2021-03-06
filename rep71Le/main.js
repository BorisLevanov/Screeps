var actions = require('actions')
var battle = require('battle')
var towers = require('towers')



module.exports.loop = function () {
    console.log('-------------------------------------------')
    for (var creepName in Memory.creeps) {
        // console.log(creepMemoryCell)
        if (!Game.creeps[creepName]) {
            delete Memory.creeps[creepName]
            console.log('Clearing non-existing creep memory:', creepName)
        }
    }


    function customBodySize(requiredBodyParts) {

        var bodySizeResult = []
        for (bodyPart in requiredBodyParts) {
            for (i = 0; i < requiredBodyParts[bodyPart]; i++) {
                bodySizeResult.push(bodyPart)
            }
        }
        return bodySizeResult
    }

    // Run towers
    for (var thisSpawn in Game.spawns) {

        function timer() {
            if (!Memory.noEnergyTimer) {
                Memory.noEnergyTimer = {}
            } else {
                if (!Memory.noEnergyTimer[thisSpawn]) {
                    Memory.noEnergyTimer[thisSpawn] = 50
                }
            }
            Memory.noEnergyTimer[thisSpawn]--
        }

        towers.tick(Game.spawns[thisSpawn])

        var harvestersPerRoom = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.homeRoom == thisSpawn)
        var suckersPerRoom = _.filter(Game.creeps, (creep) => creep.memory.role == 'sucker' && creep.memory.homeRoom == thisSpawn)


        /**
         * Spawns screeps based on requested type and limit
         * @param {String} screepType - type of screep, i.e. screepType
         * @param {Integer} screepLimit - how many Screeps to spawn
         * @param {Integer} screepLevel - body identifier
         */
        function spawnScreep(screepType, screepLimit, screepLevel) {


            // console.log(thisSpawn + ':' + screepType)
            // console.log('Checking new ' + screepType + ': ')
            var screepCounter = _.filter(Game.creeps, (creep) => creep.memory.role == screepType && creep.memory.homeRoom == thisSpawn)
            // console.log(screepCounter.length + ' / ' + screepLimit)

            if (screepCounter.length < screepLimit) {
                var bodySize
                switch (screepType + '|' + screepLevel) {

                    case 'sucker|Lv4':
                        bodySize = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
                        break

                    case 'sucker|Lv5':
                        bodySize = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
                        break

                    case 'harvester|Lv2':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
                        break

                    case 'harvester|Lv3':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
                        break

                    case 'upgrader|Lv2':
                        bodySize = customBodySize({
                            [WORK]: 4,
                            [CARRY]: 1,
                            [MOVE]: 2
                        })
                        break


                    case 'fixer|Lv2':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
                        break

                    case 'builder|Lv2':
                        bodySize = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
                        break

                    case 'upgrader|Lv3':
                    case 'fixer|Lv3':
                    case 'builder|Lv3':
                        bodySize = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
                        break

                    case 'zaslanec|Lv1':
                        bodySize = [CLAIM, MOVE]
                        break

                    case 'zaslanec|Lv2':
                        bodySize = customBodySize({
                            [CLAIM]: 2,
                            [MOVE]: 4
                        })
                        break

                    case 'shotgun|Lv1':
                        bodySize = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, MOVE, MOVE]
                        break

                    case 'railgun|Lv0':
                        bodySize = [RANGED_ATTACK, MOVE]
                        break

                    case 'railgun|Lv1':
                        bodySize = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE]
                        break

                    case 'aybolit|Lv1':
                    case 'railgun|Lv1':
                    case 'target|Lv1':
                        bodySize = customBodySize({
                            [WORK]: 0,
                            [CARRY]: 0,
                            [MOVE]: 1
                        })
                        break

                    default:
                        bodySize = [WORK, CARRY, MOVE]
                        break
                }



                var screepName = screepType + Game.time
                console.log(thisSpawn + ' - Spawning new ' + screepType + ': ' + screepName + '; ' + screepLevel)
                Game.spawns[thisSpawn].spawnCreep(bodySize, screepName, {
                    memory: {
                        role: screepType,
                        homeRoom: thisSpawn
                    }
                })


            }

        }


        var spawnLogic = {
            "Base01": {
                'sucker': {
                    'Lv1': 0,
                    'Lv2': 0,
                    'Lv3': 0,
                    'Lv4': 0
                },
                'harvester': {
                    'Lv1': 0,
                    'Lv2': 0,
                    'Lv3': 0,
                    'Lv4': 0
                }
            }
        }


        if (harvestersPerRoom.length == 0) {
            console.log(thisSpawn + ': Emergency harvester spawn active!')
            spawnScreep('harvester', 1, 'Lv1')
        } else {
            switch (thisSpawn) {
                case 'Base01':

                    /*
                    // battle.designateSquads()
                    spawnScreep('target', 2, 'Lv1')
                    spawnScreep('aybolit', 2, 'Lv1')
                    */

                    // Spawn harvesters as priority
                    spawnScreep('sucker', 1, 'Lv4')
                    spawnScreep('harvester', 3, 'Lv3')
                    // Do not spawn anything else until 3 harvesters exist
                    if (harvestersPerRoom.length >= 3 && suckersPerRoom.length >= 1) {
                        // If there's enough harvesters, spawn other units
                        spawnScreep('fixer', 2, 'Lv3')
                        spawnScreep('upgrader', 2, 'Lv3')
                        spawnScreep('builder', 2, 'Lv3')
                        spawnScreep('zaslanec', 2, 'Lv2')
                        //if (Game.spawns[thisSpawn].room.memory.yellowAlert == true) {
                        spawnScreep('railgun', 2, 'Lv1')
                        //spawnScreep('shotgun', 3, 'Lv1')
                    }
                    break

                case 'Base02':

                    spawnScreep('harvester', 3, 'Lv3')
                    if (harvestersPerRoom.length >= 3) {
                        spawnScreep('fixer', 1, 'Lv2')
                        spawnScreep('upgrader', 3, 'Lv3')
                        spawnScreep('builder', 1, 'Lv2')

                    }
                    break

                case 'Base03':
                    spawnScreep('harvester', 3, 'Lv2')
                    if (harvestersPerRoom.length >= 3) {
                        spawnScreep('fixer', 1, 'Lv1')
                        spawnScreep('upgrader', 4, 'Lv2')
                        spawnScreep('builder', 1, 'Lv1')
                        //spawnScreep('railgun', 3, 'Lv0')
                    }
                    break

            }
        }
        // Creep spawner
        if (Game.spawns[thisSpawn].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[thisSpawn].spawning.name]
            Game.spawns[thisSpawn].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[thisSpawn].pos.x + 1,
                Game.spawns[thisSpawn].pos.y, {
                    align: 'left',
                    opacity: 0.8
                })
        }
    }

    // Creep runner
    for (var name in Game.creeps) {
        var thisCreep = Game.creeps[name],
            creepIdentifier = require('role.' + Game.creeps[name].memory.role)
        creepIdentifier.run(thisCreep, actions)
    }
}