var roleFixer = {

    /** @param {Creep} creep **/
    run: function(creep, actions) {
        var preferredSourceGather
            // creep.memory.repairing = true
        switch (creep.memory.homeRoom) {
            case 'Base01':
                preferredSourceGather = 0
                break

            default:
                preferredSourceGather = 0
        }

        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false

        }
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true

        }
        // actions.createRoads(creep)
        if (creep.memory.repairing) {
            console.log(actions.energyToTower(creep).length)
            if (actions.energyToTower(creep).length == 0) {
                if (actions.repairStructure(creep).length == 0) {
                    actions.buildStructure(creep)
                }
            }
        } else {
            if (actions.getDroppedResource(creep).length == 0) {
                actions.energyFromSources(creep, preferredSourceGather)
            }
        }
    }

}


module.exports = roleFixer