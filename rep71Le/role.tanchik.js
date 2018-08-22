var roleTanchik = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var roomName = 'W43N36';
        console.log(roomName)
        console.log(creep.room.name)
        if (creep.room.name != roomName) {
            console.log('GO')
            const exitDir = creep.room.findExitTo(roomName);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            // var enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, { filter: function (i) { return i.owner.username != 'Invader' } });
            const target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

            if (target) {
                console.log(target)
                    //target.sort(function(a, b) {
                    //    return a.hits - b.hits;
                    //});
                creep.moveTo(target);
                creep.attack(target);
            }
        }


    }
};

module.exports = roleTanchik;