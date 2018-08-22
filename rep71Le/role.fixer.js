var roleFixer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var fixerOddEven = parseInt(creep.name.replace('fixer', '')),
            preferredContainerDeliver = 0,
            preferredSourceGather = fixerOddEven % 2;

        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing) {
            var towers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
                        (structure.energy < (structure.energyCapacity));
                }
            });

            if (towers.length > 0) {
                if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    creep.say('I tower.');
                }

            } else {
                var structureTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.hits < (structure.hitsMax / 1.5)
                    }
                });
                structureTargets.sort((a, b) => a.hits - b.hits);

                if (creep.repair(structureTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureTargets[0]);
                    creep.say('I fix.');
                }

            }
        } else {
            var droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);

            if (droppedEnergy.length) {
                console.log('found ' + droppedEnergy[0].energy + ' energy at ', droppedEnergy[0].pos);
                if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[0], { visualizePathStyle: { stroke: '#FF0000' } });
                    creep.say('I take!');
                }
            } else {

                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[preferredSourceGather]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[preferredSourceGather]);
                }
            }
        }
    }
};
module.exports = roleFixer;