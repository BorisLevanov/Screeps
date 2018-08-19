var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.room.name != 'W43N35') {
            const exitDir = creep.room.findExitTo('W43N35', ['W43N35']);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        } else {

            if (creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }
            if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }

            if (creep.memory.upgrading) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                    creep.say('⚡ upgrade');
                }
            } else {

                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            (_.sum(structure.store) > 0);
                    }
                });
                // containers = _.sortBy(containers, s => creep.pos.getRangeTo(s))

                var sources = creep.room.find(FIND_SOURCES);
                if (containers.length > 0) {
                    if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0])
                    }
                } else {
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;