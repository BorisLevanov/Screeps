var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, actions) {
        var preferredSourceGather

        switch (creep.memory.homeRoom) {
            case 'Base01':
                preferredSourceGather = 1
                break

            default:
                preferredSourceGather = 0
                preferredContainerDeliver = 0
        }

        if (creep.carry.energy < creep.carryCapacity) {
            //if (actions.energyFromContainer(creep).length == 0) {
            actions.energyFromSources(creep, preferredSourceGather)
            actions.requestHighway(creep)
                //}
        } else {
            if (actions.energyToBase(creep).length == 0) {
                if (actions.energyToContainer(creep).length == 0) {
                    creep.say('⏳')
                    var baseLocation = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN) }
                    })

                    creep.moveTo(baseLocation[0])
                }
            }
        }

    }
}
module.exports = roleHarvester