var roleSucker = {

    /** @param {Creep} creep **/
    run: function(creep, actions) {
        var preferredSourceGather

        switch (creep.memory.homeRoom) {
            case 'Base01':
                preferredSourceGather = 0
                break

            default:
                preferredSourceGather = 0
        }

        if (creep.carry.energy < creep.carryCapacity) {
            actions.energyFromSources(creep, preferredSourceGather)
        } else {
            if (actions.energyToContainer(creep, ).length == 0) {
                actions.energyToBase(creep).length
                creep.say('⏳')

            }
        }

    }
}
module.exports = roleSucker