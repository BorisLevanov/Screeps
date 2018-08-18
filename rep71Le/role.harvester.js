var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

        if (creep.room.name != 'W43N35') {
            const exitDir = creep.room.findExitTo('W43N35', ['W43N35']);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        } else {

            if (creep.carry.energy < creep.carryCapacity) {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
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
                
                /*
                console.log(targetsTwo.length)
                    for (var i = 0; i < containers.length; i++) {
                        console.log((i + 1) + ': ' + containers[i].structureType)
                        
                    }
                */
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    } 
                } else {
                    if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    } 
                }
            }
        }
    }
};

module.exports = roleHarvester;