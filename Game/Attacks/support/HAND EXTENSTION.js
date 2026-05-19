registerAttack('HAND EXTENSTION', {
  stats: { type: 'Basic', cooldown: { time: 9000, switch: false } },
  action: (player, target) => {
    if (player.sharpened) return; // Prevent stacking

    const BOOST = 0.15;
    const DURATION = 6000;

    player.stats.spd *= (BOOST + 1);
    if (!player.incRange) player.incRange = 1.15
    else player.incRange += BOOST

    stun(player, 400);
    spawnEffect(player.x, player.y, player.width, player.height, '#a4a89d', 600);
    player.indicate(`${player.name} stretched out its arm increasing mobility and range on certain moves!`);
    playRetreivedAudio('sharpness')
    
  }
});