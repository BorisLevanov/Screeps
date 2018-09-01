var battle = {

    designateSquads: function () {
        var screepSquads = {
            "Crazy Badgers": {
                "targets": [],
                "railguns": [],
                "aybolits": [],

                'hunt destination': '',
                'leader position': '',
                wait: [false]
            },

            "Outrageous Retards": {
                "targets": [],
                "railguns": [],
                "aybolits": [],

                'hunt destination': '',
                'leader position': '',
                wait: [false]
            },
        }

        if (!Memory.screepSquads) {
            Memory.screepSquads = screepSquads
        }

        for (const screepDesignation in screepSquads["Crazy Badgers"]) {
            var requiredSquadSize = {
                "targets": 2,
                "railguns": 3,
                "aybolits": 4,

            }

            screepRole = screepDesignation.slice(0, screepDesignation.length - 1)

            const existingRecruits = Memory.screepSquads["Crazy Badgers"][screepDesignation]
            const requiredRecruits = requiredSquadSize[screepDesignation]

            const potentialRecruits = _(Game.creeps).filter({
                memory: {
                    role: screepRole
                }
            }).value()

            for (const potentialRecruit in potentialRecruits) {
                if (existingRecruits) {
                    if (existingRecruits.length < requiredRecruits) {
                        if (potentialRecruit) {
                            var recruit = potentialRecruits[potentialRecruit].toString()
                            const recruitName = recruit.slice(7, recruit.length - 1)
                            console.log('In memory? ' + !recruitName in Memory.screepSquads["Crazy Badgers"][screepDesignation])
                            if (Memory.screepSquads["Crazy Badgers"][screepDesignation].length <= requiredRecruits &&
                                !Memory.screepSquads["Crazy Badgers"][screepDesignation].includes(recruitName)) {

                                console.log("Pushing" + recruit)
                                Memory.screepSquads["Crazy Badgers"][screepDesignation].push(recruitName)
                            }


                            
                                console.log(recruitName)
                            if (!Game.creeps[recruitName]) {
                               delete Memory.screepSquads['Crazy Badgers'][screepDesignation][recruitName]
                            }
                        }
                    }
                }
            }
        }



        return JSON.stringify(Memory.screepSquads)


    },


}
module.exports = battle