var roleZaslanec = {
    /** @param {Creep} creep **/
    run: function (creep, actions) {
        if (Game.flags.Occupy.room != creep.room) {
            creep.moveTo(Game.flags.Occupy, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            })
        } else {
            var target = Game.flags.Occupy
            creep.reserveController(creep.room.controller)
            creep.moveTo(target)
        }
    }
}

module.exports = roleZaslanec