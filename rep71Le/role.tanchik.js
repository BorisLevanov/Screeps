var roleTanchik = {
    /** @param {Creep} creep **/
    run: function(creep, actions) {
        var roomName = 'W43N36'
        if (creep.room.name != roomName) {
            const exitDir = creep.room.findExitTo(roomName)
            const exit = creep.pos.findClosestByRange(exitDir)
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } })
        } else {
            // var enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, { filter: function (i) { return i.owner.username != 'Invader' } })
            const target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)

            if (target) {
                console.log(target)
                    //target.sort(function(a, b) {
                    //    return a.hits - b.hits
                    //})
                creep.moveTo(target)
                creep.attack(target)
            } else {
                var sources = creep.room.find(FIND_SOURCES)
                if (creep.moveTo(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } })
                }
            }
        }


    }
}

module.exports = roleTanchik