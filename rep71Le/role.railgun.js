var roleRailgun = {
        /** @param {Creep} creep **/
        run: function(creep, actions) {
            var roomName = 'W43N34'
            if (creep.room.name != roomName) {
                const exitDir = creep.room.findExitTo(roomName)
                const exit = creep.pos.findClosestByRange(exitDir)
                creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } })
            } else {
                // var enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, { filter: function (i) { return i.owner.username != 'Invader' } })
                const targetCreeps = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: object => Memory.whitelist.indexOf(object.owner.username)==-1})
                var enemystructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES/*, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER)
                    }
                }*/)
                
                if (targetCreeps) {
                    creep.moveTo(targetCreeps)
                    creep.attack(targetCreeps)
                } else {
                    creep.moveTo(enemystructure)
                    creep.rangedAttack(enemystructure)
                }
            }
    
    
        }
    }
    
    module.exports = roleRailgun