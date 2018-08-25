var actions = {

    energyFromSources: function(creep, preferredSourceGather) {
        var sources = creep.room.find(FIND_SOURCES)
        if (creep.harvest(sources[preferredSourceGather]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[preferredSourceGather], { visualizePathStyle: { stroke: '#ffaa00' } })
            creep.say('⛏️')
        }

        if (sources.length == 0) {
            console.log(sources[preferredSourceGather])
            creep.moveTo(sources[preferredSourceGather], { visualizePathStyle: { stroke: '#ffaa00' } })
        }
        return sources
    },



    energyFromContainer: function(creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                    (_.sum(structure.store) > 0)
            }
        })
        if (containers.length > 0) {
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0])
            }
        }
        return containers
    },



    energyToContainer: function(creep, preferredContainerDeliver) {

        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                    (_.sum(structure.store) < structure.storeCapacity)
            }
        })

        containers = _.sortBy(containers, s => creep.pos.getRangeTo(s))
        if (creep.transfer(containers[preferredContainerDeliver], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.say('📦')
            creep.moveTo(containers[preferredContainerDeliver], { visualizePathStyle: { stroke: '#ffffff' } })
        }
        return containers
    },



    energyFromStorage: function(creep) {

    },



    energyToStorage: function(creep) {
        var storageTank = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) &&
                    (_.sum(structure.store) < structure.storeCapacity)
            }
        })

        if (creep.transfer(storageTank[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storageTank[0], { visualizePathStyle: { stroke: '#ffffff' } })
        }

        return storageTank
    },



    energyToBase: function(creep) {
        var baseStorageUnits = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    (structure.energy < structure.energyCapacity)
            }
        })

        baseStorageUnits = _.sortBy(baseStorageUnits, s => creep.pos.getRangeTo(s))

        if (creep.transfer(baseStorageUnits[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.say('🏭')
            creep.moveTo(baseStorageUnits[0], { visualizePathStyle: { stroke: '#ffffff' } })
        }

        return baseStorageUnits
    },

    energyToTower: function(creep) {
        var towers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    (structure.energy < (structure.energyCapacity / 2));
            }
        });

        if (towers.length > 0) {
            if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('🔫')
                creep.moveTo(towers[0], { visualizePathStyle: { stroke: '#ffffff' } });
                creep.say('I tower.');
            }

            return towers
        }
    },

    buildStructure: function(creep) {
        var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES)
            //var towers = creep.room.find(FIND_STRUCTURES, {
            //    filter: (structure) => {
            //        return (structure.structureType == STRUCTURE_TOWER) &&
            //            (structure.energy < structure.energyCapacity)
            //    }
            //})


        if (constructionSites.length) {
            creep.say('🏗️')
            if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSites[0], { visualizePathStyle: { stroke: '#ffffff' } })
            }
        }
        return constructionSites
    },

    repairStructure: function(creep) {
        var structureTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_CONTAINER) &&
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



    upgradeController: function(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.say('⚡')
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } })
        }
    },



    getDroppedResource: function(creep) {

        var droppedEnergy = creep.room.find(FIND_TOMBSTONES, {
            filter: (t) => {
                return (_.sum(t.store) > 0);
            }
        });

        if (droppedEnergy.length > 0) {
            if (creep.withdraw(droppedEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('💰')
                creep.moveTo(droppedEnergy[0]);
            }
        }

        return droppedEnergy
    },


    createRoads: function(creep) {
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


    markRoad: function(creep) {
        const creepPosition = creep.pos.toString()
        console.log(creepPosition)
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
    }

}
module.exports = actions