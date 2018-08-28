var battle = {

    designateSquads: function() {
      
    //var screepSquads = {
    //    "Crazy Badgers": {
    //        "captains": [],
    //        "shotguns": [],
    //        "railguns": [],
    //        "aybolits": [],
    //        "harvesters": []
    //    },
    //}





    var screepSquads = {
        "Crazy Badgers": {
            "fixers": [],
            "upgraders": [],
            "builders": [],
            "harvesters": []
        },
    }

    if (!Memory.screepSquads) {
        Memory.screepSquads = screepSquads
    }

    for (const screepDesignation in screepSquads["Crazy Badgers"]) {
        var requiredSquadSize = {
            "fixers": 1,
            "upgraders": 2,
            "builders": 1,
            "harvesters": 2
        }

        screepRole = screepDesignation.slice(0, screepDesignation.length - 1)

        const existingRecruits = Memory.screepSquads["Crazy Badgers"][screepDesignation]
        const requiredRecruits = requiredSquadSize[screepDesignation]
        console.log(existingRecruits.length + '|' + requiredRecruits)

        const potentialRecruits = _(Game.creeps).filter({
            memory: {
                role: screepRole
            }
        }).value()

        for (const potentialRecruit in potentialRecruits) {
            if (existingRecruits.length < requiredRecruits) {
                if (potentialRecruit) {
                    var recruit = potentialRecruits[potentialRecruit].toString()
                    const recruitName = recruit.slice(7, recruit.length - 1)
                    if (Memory.screepSquads["Crazy Badgers"][screepDesignation].length <= requiredRecruits &&
                        !(recruitName in Memory.screepSquads["Crazy Badgers"][screepDesignation])) {
                        console.log("Pushing" + recruit)
                        Memory.screepSquads["Crazy Badgers"][screepDesignation].push(recruitName)
                    }
                }
            }
        }
    }
    return JSON.stringify(Memory.screepSquads)


    },
}
module.exports = battle