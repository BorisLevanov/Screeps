var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var harvesterOddEven = parseInt(creep.name.replace('harvester', '')),
            preferredContainerDeliver = 0,
            preferredSourceGather = harvesterOddEven % 2;

        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[preferredSourceGather]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[preferredSourceGather], { visualizePathStyle: { stroke: '#ffaa00' } });
            }

            if (sources.length == 0) {
                console.log(sources[preferredSourceGather])
                creep.moveTo(sources[preferredSourceGather], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            var baseStorageUnits = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        (structure.energy < structure.energyCapacity);
                }
            });

            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        (_.sum(structure.store) < structure.storeCapacity);
                }
            });

            containers = _.sortBy(containers, s => creep.pos.getRangeTo(s))

            if (baseStorageUnits.length > 0) {
                if (creep.transfer(baseStorageUnits[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(baseStorageUnits[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                if (creep.transfer(containers[preferredContainerDeliver], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[preferredContainerDeliver], { visualizePathStyle: { stroke: '#ffffff' } });
                } else {
                    var sources = creep.room.find(FIND_SOURCES);
                    creep.moveTo(sources[preferredSourceGather], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }

    }
};

module.exports = roleHarvester;