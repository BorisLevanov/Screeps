var actions = {

    energyFromSources: function (creep, preferredSourceGather) {
        var sources = creep.room.find(FIND_SOURCES
            /*, {
                        filter: (source) => { return source.energy > 0 }
                    }*/
        )

        if (creep.harvest(sources[preferredSourceGather]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[preferredSourceGather], {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            })
            creep.say('⛏️')
        }

        if (sources.length == 0) {
            console.log(sources[preferredSourceGather])
            creep.moveTo(sources[preferredSourceGather], {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            })
        }
        return sources
    },



    energyFromContainer: function (creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                    (_.sum(structure.store) > 0)
            }
        })
        containers = _.sortBy(containers, s => creep.pos.getRangeTo(s))
        if (containers.length > 0) {
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0])
            }
        }
        return containers
    },



    energyToContainer: function (creep) {

        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                    (_.sum(structure.store) < structure.storeCapacity)
            }
        })

        containers = _.sortBy(containers, s => creep.pos.getRangeTo(s))
        if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.say('📦')
            creep.moveTo(containers[0], {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            })
        }

        return containers
    },



    energyFromStorage: function (creep) {

    },



    energyToStorage: function (creep) {
        var storageTank = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) &&
                    (_.sum(structure.store) < structure.storeCapacity)
            }
        })

        if (creep.transfer(storageTank[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storageTank[0], {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            })
        }

        return storageTank
    },



    energyToBase: function (creep) {
        var baseStorageUnits = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    (structure.energy < structure.energyCapacity)
            }
        })

        baseStorageUnits = _.sortBy(baseStorageUnits, s => creep.pos.getRangeTo(s))

        if (creep.transfer(baseStorageUnits[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.say('🏭')
            creep.moveTo(baseStorageUnits[0], {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            })
        }

        return baseStorageUnits
    },

    energyToTower: function (creep) {
        var towers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    (structure.energy < (structure.energyCapacity - 100));
            }
        });

        if (towers.length > 0) {
            towers = _.sortBy(towers, s => creep.pos.getRangeTo(s));
            if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('🔫')
                creep.moveTo(towers[0], {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
        }

        return towers
    },

    buildStructure: function (creep) {
        var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES)
        //var towers = creep.room.find(FIND_STRUCTURES, {
        //    filter: (structure) => {
        //        return (structure.structureType == STRUCTURE_TOWER) &&
        //            (structure.energy < structure.energyCapacity)
        //    }
        //})
        // console.log(creep.pos +' ' + Game.flags.Occupy.pos)

        if (constructionSites.length) {
            creep.say('🏗️')

            if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSites[0], {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                })
            }
        }
        return constructionSites
    },

    repairStructure: function (creep) {
        var structureTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType != STRUCTURE_WALL) &&
                    structure.hits < (structure.hitsMax / 1.5)
            }
        })

        structureTargets.sort((a, b) => a.hits - b.hits)

        if (creep.repair(structureTargets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structureTargets[0])
            creep.say('🛠️')
        }
        return structureTargets
    },



    upgradeController: function (creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.say('⚡')
            creep.moveTo(creep.room.controller, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            })
        }
    },



    getDroppedResource: function (creep) {

        var droppedTomb = creep.room.find(FIND_TOMBSTONES, {
            filter: (t) => {
                return (_.sum(t.store) > 0);
            }
        });

        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES);

        if (droppedEnergy.length > 0) {
            if (creep.pickup(droppedEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('💰')
                creep.moveTo(droppedEnergy[0]);
            }
        }

        if (droppedTomb.length > 0) {
            if (creep.withdraw(droppedTomb) == ERR_NOT_IN_RANGE) {
                creep.say('💰')
                creep.moveTo(droppedTomb[0]);
            }
        }

        return droppedEnergy
    },


    requestHighway: function (creep) {
        var roads = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD)
            }
        });
        roads = _.sortBy(roads, s => creep.pos.getRangeTo(s));
        if (roads.length) {
            var roadCor = roads[0].pos;
        }
        if (!creep.pos.isEqualTo(roadCor)) {
            creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD)
        }
        return roads
    },


    memoryRoads: function (creep) {
        const creepPosition = creep.pos.toString()
        try {
            Memory.allRoads[creepPosition]
        } catch (e) {
            console.log('Recording a new road: ' + creep.pos.toString())
            Memory.allRoads = {
                [creepPosition]: 0
            }
        }

        var currentMemory = Memory.allRoads[creepPosition]
        var newMemory = currentMemory + 1

        Memory.allRoads[creepPosition] = newMemory
    },

    goToLeader: function (creep) {

        var squadMemory = Memory.screepSquads["Crazy Badgers"]
        var leaderPosition = squadMemory['leader position']
        var leaderName = squadMemory['targets'][0]
        var leaderLocation = Game.creeps[leaderName]

        creep.moveTo(leaderLocation)

        if ((Math.abs(leaderPosition.x - creep.pos.x) > 5 || Math.abs(leaderPosition.y - creep.pos.y) > 5) && leaderPosition.roomName == creep.room) {
            creep.moveTo(leaderLocation)
        } else {
            creep.moveTo(squadMemory['hunt destination'])
        }
    }
}
module.exports = actions