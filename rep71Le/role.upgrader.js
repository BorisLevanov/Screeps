var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, actions) {
        var preferredContainerGather
        var preferredSourceGather

        switch (creep.memory.homeRoom) {
            case 'Base01':
                preferredSourceGather = 1
                break

            default:
                preferredSourceGather = 0
                preferredContainerGather = 0
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

            if (actions.energyFromContainer(creep, preferredContainerGather).length == 0) {
                if (actions.energyFromSources(creep, preferredSourceGather).length == 0) {}
            }
        }
    }

}

module.exports = roleUpgrader