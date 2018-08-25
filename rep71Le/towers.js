var towers = {

    /** @param {Game} game **/
    tick: function() {
        towers = Game.spawns.Base01.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        })
        _.forEach(towers, function(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.hits < (structure.hitsMax / 2)
                    }
            })
            // console.log(tower.energy + '/' + (tower.energyCapacity / 4))
            //console.log(closestDamagedStructure.hits + ' / ' + closestDamagedStructure.hitsMax + ' (' + closestDamagedStructure.hitsMax / 2 + ')')
            if (tower.energy > (tower.energyCapacity / 4)) {
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure)
                }
            }
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if (closestHostile) {
                tower.attack(closestHostile)
            }
        })
    }
}

module.exports = towers