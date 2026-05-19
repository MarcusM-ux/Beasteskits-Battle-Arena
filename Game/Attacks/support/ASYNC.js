registerAttack('ASYNC', {
  stats: { type: 'Dark', cooldown: { time: 12000, switch: false } },
  action: (player, target) => {
    const PROXIMITY = (player.isCPU) ? 9999 : 150; // Must be within 150px to trigger
    const COPY_DURATION = 8000;

    const dist = Math.abs((player.x + player.width / 2) - (target.x + target.width / 2));
    if (dist > PROXIMITY) {
      player.indicate(`${player.name} needs to get closer!`);
      return;
    }

    if (player.asyncActive) return;

    stun(player, 300);

    // Cache player's real stats
    const originalStats = {
      atk: player.stats.atk,
      def: player.stats.def,
      spd: player.stats.spd,
      image: player.image.src
    };

    // Copy target's stats and appearance
    player.stats.atk = target.stats.atk;
    player.stats.def = target.stats.def;
    player.stats.spd = target.stats.spd;
    player.image.src = target.image.src; // Swap visual to look like target
    player.asyncActive = true;

    spawnEffect(player.x, player.y, player.width, player.height, 'rgba(80,0,120,0.5)', 500);
    player.indicate(`${player.name} copied ${target.name}!`);
    target.indicate(`${target.name}'s identity was stolen!`);

    copyMoveset(player, target);
    
    // Clear any existing timeout to prevent memory leaks
    if (player.asyncTimeout) clearTimeout(player.asyncTimeout);
    
    player.asyncTimeout = setTimeout(() => {
      // Restore original stats
      player.stats.atk = originalStats.atk;
      player.stats.def = originalStats.def;
      player.stats.spd = originalStats.spd;
      player.image.src = originalStats.image;
      player.asyncActive = false;
      player.indicate(`${player.name} reverted to their true form.`);
      restoreCopiedMoveset(player);
    }, COPY_DURATION);
  }
});


// ============================================
// MOVESET SWAP ATTACKS
// ============================================

const movesetBackup = {
  player1: null,
  player2: null
};

/**
 * COPY MOVESET — copies the target's moves onto the attacker's key slots
 */
function copyMoveset(attacker, target) {
  const attackerSlot = attacker.isPlayer1 ? 'player1' : 'player2';
  const attackerKeys = attacker.isPlayer1 ? ['q', 'e', 'z', 'x'] : ['o', 'p', 'k', 'l'];
  const targetKeys = target.isPlayer1 ? ['q', 'e', 'z', 'x'] : ['o', 'p', 'k', 'l'];

  // Back up attacker's current moveset before overwriting
  movesetBackup[attackerSlot] = {};
  for (const key of attackerKeys) {
    const move = attacker.keysToAttack[key];
    if (!move?.name) continue;
    movesetBackup[attackerSlot][key] = {
      name: move.name,
      stats: JSON.parse(JSON.stringify(move.stats))
    };
  }

  // Copy target's moves onto attacker's key slots
  attackerKeys.forEach((attackerKey, i) => {
    const targetKey = targetKeys[i];
    const sourceMove = target.keysToAttack[targetKey];
    if (!sourceMove?.name) return;

    attacker.keysToAttack[attackerKey].name = sourceMove.name;
    attacker.keysToAttack[attackerKey].stats = JSON.parse(JSON.stringify(sourceMove.stats));
    attacker.keysToAttack[attackerKey].stats.cooldown.switch = false

    if (i === 1) {
        attacker.keysToAttack[attackerKey].name = 'ABYSSAL CLONES'
        attacker.keysToAttack[attackerKey].stats.cooldown.switch = false
        attacker.keysToAttack[attackerKey].stats = JSON.parse(JSON.stringify(attackFunctions['ABYSSAL CLONES'].stats));
    }
  });

  updatePlayerList(attacker);
  attacker.indicate(`COPIED ${target.name}'s MOVES!`);
}

/**
 * RESTORE MOVESET — reverts the attacker back to their original moves.
 * Call this after a duration, on round end, or as a second attack.
 */
function restoreCopiedMoveset(attacker) {
  const attackerSlot = attacker.isPlayer1 ? 'player1' : 'player2';
  const attackerKeys = attacker.isPlayer1 ? ['q', 'e', 'z', 'x'] : ['o', 'p', 'k', 'l'];
  const backup = movesetBackup[attackerSlot];

  if (!backup) {
    return;
  }

  for (const key of attackerKeys) {
    if (!backup[key]) continue;
    attacker.keysToAttack[key].name = backup[key].name;
    attacker.keysToAttack[key].stats = JSON.parse(JSON.stringify(backup[key].stats));
  }

  movesetBackup[attackerSlot] = null;

  updatePlayerList(attacker);
  attacker.indicate('MOVESET RESTORED!');
}
