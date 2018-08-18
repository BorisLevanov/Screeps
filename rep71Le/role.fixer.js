var roleFixer = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.reparing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_WALL) &&
                        structure.hits < (structure.hitsMax / 2)
                }
            });
            targets.sort((a, b) => a.hits - b.hits);
            if (targets.length > 0) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    creep.say('I fix.');
                }
            } else {
                console.log('Nothing to fix')
                creep.moveTo(Game.flags.SavePoint)
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};
module.exports = roleFixer;