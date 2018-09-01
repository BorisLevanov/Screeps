var towers = {

    /** @param {Game} game **/
    tick: function(spawnIdentifier) {
        towers = spawnIdentifier.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        })
        _.forEach(towers, function(tower) {
            var mostDamagedStructure = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL) &&
                        structure.hits < (structure.hitsMax / 20000)
                    }
            })
            mostDamagedStructure.sort((a, b) => a.hits - b.hits)
            // console.log(mostDamagedStructure)
            // console.log(mostDamagedStructure.hits + ' / ' + mostDamagedStructure.hitsMax + ' (' + mostDamagedStructure.hitsMax / 2 + ')')
            if (tower.energy > (tower.energyCapacity / 4)) {
                if (mostDamagedStructure) {
                    tower.repair(mostDamagedStructure[0])
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