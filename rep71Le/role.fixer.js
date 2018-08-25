var roleFixer = {

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

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false

        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true

        }
        // actions.createRoads(creep)
        if (creep.memory.building) {
            if (actions.energyToTower(creep) == 0) {
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