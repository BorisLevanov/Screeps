var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep, actions) {
        var preferredSourceGather

        switch (creep.memory.homeRoom) {
            case 'Base01':
                preferredSourceGather = 1
                break

            default:
                preferredSourceGather = 0
        }



        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true
        }

        if (creep.memory.upgrading) {
            actions.upgradeController(creep)
        } else {


            if (actions.getDroppedResource(creep).length == 0) {
                if (actions.energyFromContainer(creep).length == 0) {
                    actions.energyFromSources(creep, preferredSourceGather)
                    //actions.requestHighway(creep)
                }
            }
        }
    }

}

module.exports = roleUpgrader