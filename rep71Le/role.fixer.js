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
            if (actions.energyToTower(creep).length == 0) {
                if (actions.repairStructure(creep).length == 0) {
                    actions.buildStructure(creep)
                }
            }
        } else {
            if (actions.getDroppedResource(creep).length == 0) {                
                if (actions.energyFromContainer(creep).length == 0) {                    
                    actions.energyFromSources(creep, preferredSourceGather)
                    actions.requestHighway(creep)
                }
            }
        }
    }

}


module.exports = roleFixer