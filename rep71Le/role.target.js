var target = {
        /** @param {Creep} creep **/

        run: function (creep, actions) {
                var destinationOne = Game.flags.Poligon1
                var destinationTwo = Game.flags.Poligon2

                creep.say('🚩', [true])

                if (creep.memory.destination == 'destinationOne') {
                        creep.moveTo(destinationOne)                        
                } else {
                        creep.moveTo(destinationTwo)
                }


                if (creep.pos.isNearTo(destinationOne)) {
                        creep.memory.destination = 'destinationTwo'
                        Memory.screepSquads["Crazy Badgers"]['hunt destination'] = destinationTwo
                }

                if (creep.pos.isNearTo(destinationTwo)) {
                        creep.memory.destination = 'destinationOne'
                        Memory.screepSquads["Crazy Badgers"]['hunt destination'] = destinationOne
                }

        }

}
module.exports = target