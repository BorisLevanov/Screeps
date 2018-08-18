var spawnUpgrader = {

    run: function spawnUpgrader(levelUpgrader, spawnerUpgrader) {
        if (levelUpgrader == 1) {
            //var body = [WORK, CARRY, CARRY, CARRY, MOVE]; // No extensions. Cost = Æ 300
            var body = [WORK, WORK, CARRY, MOVE]; // 1 Extension. Cost = Æ 350
        }
        if (levelUpgrader == 2) {
            var body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        if (levelUpgrader == 3) {
            var body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }

        // Assign the value of counter from memory
        var counter = Memory.upgraderCounter.serialNumber;
        // Attempt to spawn a Screep
        var newName = Game.spawns[spawnerUpgrader].createCreep(body, 'Upgrader ' + counter, { role: 'upgrader' });
        console.log('Spawning new screep: ' + newName + '; Role = upgrader, Level = ' + levelUpgrader);
        if (newName == -3) {
            counter++;
            Memory.upgraderCounter = { serialNumber: counter }
        }
    }
};

module.exports = spawnUpgrader;