var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, actions) {
        var preferredContainerDeliver
        var preferredSourceGather

        switch (creep.memory.homeRoom) {
            case 'Base01':
                preferredSourceGather = 1
                break

            default:
                preferredSourceGather = 0
                preferredContainerDeliver = 0
        }
        actions.createRoads(creep)
        if (creep.carry.energy < creep.carryCapacity) {
            actions.energyFromSources(creep, preferredSourceGather)
        } else {
            if (actions.energyToBase(creep).length == 0) {
                if (actions.energyToContainer(creep, preferredContainerDeliver).length == 0) {
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