var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep, actions) {
        var preferredSourceGather

        //        if (Game.flags.Occupy.room != creep.room) {
        //            creep.moveTo(Game.flags.Occupy, {
        //                visualizePathStyle: {
        //                    stroke: '#ffffff'
        //                }
        //            })
        //        } else {
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
        // actions.markRoad(creep)
        if (creep.memory.building) {
            if (actions.buildStructure(creep).length == 0) {
                if (actions.energyToStorage(creep).length == 0) {
                    if (actions.energyToTower(creep) == 0) {
                        actions.repairStructure(creep).length
                    }

                }
            }
        } else {
            if (actions.energyFromContainer(creep).length == 0) {
                if (actions.getDroppedResource(creep).length == 0) {
                    actions.energyFromSources(creep, preferredSourceGather)
                }

            }
        }
        //}

    }
}

module.exports = roleBuilder