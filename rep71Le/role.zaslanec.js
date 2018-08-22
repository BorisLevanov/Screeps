var roleZaslanec = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var roomName = 'W43N36'
        if (creep.room.name != roomName) {
            const exitDir = creep.room.findExitTo(roomName);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.say('range');
                creep.moveTo(creep.room.controller);
            } else {
                creep.say('reserve');
            }
        }
    }
};

module.exports = roleZaslanec;