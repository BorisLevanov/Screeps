var roleThief = {
    run: function(creep) {
        var homeFlag = Game.flags.s1thi2h,
            remoteFlag = Game.flags.s1thi2r

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false
            creep.say('🔄 mine')
        }
        if (creep.pos.isNearTo(remoteFlag)) {
            creep.memory.anotherRoom = true
        }
        if (creep.pos.isNearTo(homeFlag)) {
            creep.memory.anotherRoom = false
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true
            creep.say('⚡ work')
        }
        var verydamaged = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax / 10
        })
        if (verydamaged.length > 0) {
            creep.memory.repairing = true
            creep.say('⚡ fix')
            var damaged = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax / 5
            })
        } else {
            creep.memory.repairing = false
        }
        var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES)
        constructionSites = _.sortBy(constructionSites, s => creep.pos.getRangeTo(s))
        if (constructionSites.length > 0) {
            creep.memory.building = true
        } else {
            creep.memory.building = false
        }


        var creepState = creep.memory.anotherRoom + '|' +
            creep.memory.building + '|' +
            creep.memory.repairing + '|' +
            creep.memory.working


        switch (creepState) {

            case 'true|false|false|true':
                console.log('Память: ' + creepState)
                creep.say('🏡')
                creep.moveTo(homeFlag)
                console.log('Moved')
                break

            case 'true|false|true|true':
            case 'true|true|true|true':
                if (creep.repair(damaged[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damaged[0])
                }
                break

            case 'true|true|false|true':
                if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    })
                }
                break

            case 'false|false|false|true':
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            (_.sum(structure.store) < 2000);
                    }
                });
                containers = _.sortBy(containers, s => creep.pos.getRangeTo(s))
                if (containers.length > 0) {
                    if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0])
                    }
                }
                break

            case 'true|false|false|false':
            case 'true|true|false|false':
            case 'true|false|true|false':
            case 'true|true|true|false':
                var thombs = creep.room.find(FIND_TOMBSTONES, {
                    filter: (t) => {
                        return (_.sum(t.store) > 0)
                    }
                })
                thombs = _.sortBy(thombs, s => creep.pos.getRangeTo(s))
                if (thombs.length > 0) {
                    if (creep.withdraw(thombs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(thombs[0])
                    }
                } else {
                    const dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
                    if (dropped) {
                        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(dropped)
                        }
                    } else {
                        var sources = creep.room.find(FIND_SOURCES)
                        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0], {
                                visualizePathStyle: {
                                    stroke: '#ffaa00'
                                }
                            })
                        }
                    }
                }

                break

            default:
                creep.say('🚲')
                creep.moveTo(remoteFlag)
        }
    }
}

module.exports = roleThief



var z = (x, y) => { x + y; }

function spawnScreep(x, y) {
    return x + y
}