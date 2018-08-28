var actions = require('actions')
module.exports.loop = function () {
    for (var creepmemo in Memory.creeps) {
        if (!Game.creeps[creepmemo]) {
            delete Memory.creeps[creepmemo]
            console.log('Clearing non-existing creep memory:', creepmemo);
        }
    }

    require('towers').tick()

    function spawnScreep(spawnName, creepType, creepLimit, creepBodyScaled, bodyLevel) {
        var creepCounter = _.filter(Game.creeps, (creep) => creep.memory.myFlag == creepIndividual);
        if (creepCounter.length < creepLimit) {
            var creepNumber = Memory.creepNumber
            creepNumber++
            if (creepNumber > 9) {
                creepNumber = 0,
                    Memory.creepNumber = creepNumber
            }
            Memory.creepNumber = creepNumber
            var creepName = creepIndividual + '.' + bodyLevel + '.' + creepNumber;
            console.log(spawnName + ' is spawning new creep: ' + creepName);
            Game.spawns[spawnName].spawnCreep(creepBodyScaled, creepName, {
                memory: {
                    role: creepType,
                    myFlag: creepIndividual
                }
            });
            if (Game.spawns[spawnName].spawning) {
                var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
                Game.spawns[spawnName].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns[spawnName].pos.x + 1,
                    Game.spawns[spawnName].pos.y, {
                        align: 'left',
                        opacity: 0.8
                    });
            }
        }
    }

    for (var aFlag in Game.flags) {
        var spawnNumber = aFlag.split('')[1];
        var creepBody = aFlag.substring(2, 5);
        var creepLimit = aFlag.split('')[6];
        var spawnName = 'Spawn' + spawnNumber
        var creepIndividual = aFlag.substring(0, 6)
        switch (creepBody) {
            case 'exp':
                creepType = 'experiment'
                break;
            case 'cla':
                creepType = 'claimer'
                break;
            case 'min':
                creepType = 'miner'
                break;
            case 'thi':
                creepType = 'thief'
                break;
            case 'wor':
                creepType = 'worker'
                break;
            case 'car':
                creepType = 'carrier'
                break;
            case 'war':
                creepType = 'warrior'
                break;
            case 'fix':
                creepType = 'fixer'
                break;
        }
        for (var mySpawn in Game.spawns) {
            var myExtensions = Game.spawns[mySpawn].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION)
                }
            })
            if (spawnName == mySpawn) {
                var bodyLevel = 0
                if (myExtensions.length > 4) {
                    bodyLevel++
                }
                if (myExtensions.length > 9) {
                    bodyLevel++
                }
                if (myExtensions.length > 19) {
                    bodyLevel++
                }
                switch (creepBody) {
                    case 'exp':
                        creepBodyScaled = [MOVE];
                        break;
                    case 'cla':
                        creepBodyScaled = [CLAIM, CLAIM, MOVE];
                        break;
                    case 'min':
                        switch (bodyLevel) {
                            case 0:
                                creepBodyScaled = [WORK, WORK, CARRY, MOVE]
                                break
                            case 1:
                                creepBodyScaled = [WORK, WORK, WORK, CARRY, CARRY, MOVE];
                                break
                            case 2:
                                creepBodyScaled = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
                                break
                            default:
                                creepBodyScaled = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                                break
                        }
                        break;
                    case 'wor':
                        switch (bodyLevel) {
                            case 0:
                                creepBodyScaled = [WORK, CARRY, CARRY, CARRY, MOVE]
                                break
                            case 1:
                                creepBodyScaled = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
                                break
                            default:
                                creepBodyScaled = [WORK, WORK, WORK,
                                    CARRY, CARRY, CARRY, CARRY, CARRY,
                                    MOVE, MOVE, MOVE, MOVE
                                ];
                                break
                        }
                        break;
                    case 'car':
                        switch (bodyLevel) {
                            case 0:
                                creepBodyScaled = [CARRY, CARRY, MOVE]
                                break
                            case 1:
                                creepBodyScaled = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
                                break
                            default:
                                creepBodyScaled = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                                break
                        }
                        break;
                    case 'war':
                        creepBodyScaled = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, ATTACK, MOVE, ATTACK,
                            MOVE, HEAL, MOVE, MOVE, MOVE, MOVE
                        ];
                        break;
                    case 'fix':
                        creepBodyScaled = [WORK, CARRY, MOVE];
                    default:
                        creepBodyScaled = [WORK, CARRY, MOVE];
                        break;
                }
                spawnScreep(spawnName, creepType, creepLimit, creepBodyScaled, bodyLevel)
            }
        }
    }

    for (var name in Game.creeps) {
        var thisCreep = Game.creeps[name],
            creepIdentifier = require('role.' + Game.creeps[name].memory.role);
        creepIdentifier.run(thisCreep, actions)
    }
}
















var towers = {
    /** @param {Game} game **/
    tick: function () {
        for (var mySpawn in Game.spawns) {
            towers = Game.spawns[mySpawn].room.find(FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            })
            _.forEach(towers, function (tower) {
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                }
            })
        }
    }
};
module.exports = towers;



function customBodySize(requiredBodyParts) {
    var bodySizeResult = []
    for (bodyPart in requiredBodyParts) {
        for (i = 0; i < requiredBodyParts[bodyPart]; i++) {
            bodySizeResult.push(bodyPart)
        }
    }
    return bodySizeResult
}

customBodySize({
    [TOUGH]: 20,
    [ATTACK]: 70,
    [MOVE]: 220
})





if (!Memory.screepSquads) {
    Memory.screepSquads = screepSquads
}

var spawnMemo = {
    spawnName: 50,
}

if (!Memory.noEnergyTimer) {
    Memory.noEnergyTimer = {}
    if (!Memory.noEnergyTimer[spawnName]) {
        Memory.noEnergyTimer.push(spawnMemo)
    }
}