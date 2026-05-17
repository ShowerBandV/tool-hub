// platform.js - 平台生成、碰撞检测、粒子、收集品
var J = window.J || {};
var C = J.config;
var S = J.state;

function triggerShake(level) {
  if (level === 'light') S.shakeAmount = Math.max(S.shakeAmount, C.SHAKE.light);
  else if (level === 'medium') S.shakeAmount = Math.max(S.shakeAmount, C.SHAKE.medium);
  else if (level === 'heavy') S.shakeAmount = Math.max(S.shakeAmount, C.SHAKE.heavy);
}

function spawnFloatingText(x, y, text, color) {
  S.floatingTexts.push({ x: x, y: y, text: text, color: color || '#222', life: 1, vy: -1.5 });
}

function getDifficulty() {
  var effectiveScore = Math.max(0, S.score - S.difficultyBase);
  return Math.floor(effectiveScore / (500 + S.reviveCount * 250));
}

function getScoreMultiplier() {
  var diff = getDifficulty();
  return 1.0 + Math.min(diff, 3) * 0.5;
}

function createPlatform(x, y, typeKey, diff) {
  typeKey = typeKey || 'NORMAL';
  diff = diff || 0;
  var typeDef = C.PLATFORM_TYPES[typeKey];
  var minW = Math.max(36, 60 - diff * 12);
  var maxW = Math.max(minW + 8, 80 - diff * 14);
  var width = minW + Math.random() * (maxW - minW);
  return {
    x: x, y: y, width: width, height: 14, type: typeKey, typeDef: typeDef, broken: false,
    moveCenterX: x, moveAmplitude: 45 + Math.random() * 65,
    moveSpeed: (0.5 + Math.random() * 1.3) * (Math.random() > 0.5 ? 1 : -1),
    movePhase: Math.random() * Math.PI * 2,
    springCompressed: false, springTimer: 0,
    jetpackCollected: false, particles: [], flashTimer: 0
  };
}

function generateInitialPlatforms() {
  S.platforms = [];
  var p = S.player;
  var startPlat = createPlatform(p.x - 35, p.y + p.height / 2 + 5, 'NORMAL', 0);
  startPlat.width = 80; startPlat.x = p.x - 40;
  S.platforms.push(startPlat);
  var currentY = startPlat.y - 55;
  for (var i = 0; i < 20; i++) {
    var gap = 50 + Math.random() * 45;
    currentY -= gap;
    var px = 25 + Math.random() * (S.WIDTH - 110);
    var typeKey = 'NORMAL';
    var heightFromStart = startPlat.y - currentY;
    var rand = Math.random();
    if (heightFromStart > 600) {
      if (rand < 0.35) typeKey = 'NORMAL';
      else if (rand < 0.55) typeKey = 'MOVING';
      else if (rand < 0.75) typeKey = 'FRAGILE';
      else if (rand < 0.92) typeKey = 'SPRING';
      else typeKey = 'JETPACK';
    } else if (heightFromStart > 300) {
      if (rand < 0.50) typeKey = 'NORMAL';
      else if (rand < 0.70) typeKey = 'MOVING';
      else if (rand < 0.85) typeKey = 'FRAGILE';
      else if (rand < 0.95) typeKey = 'SPRING';
      else typeKey = 'JETPACK';
    } else {
      if (rand < 0.65) typeKey = 'NORMAL';
      else if (rand < 0.80) typeKey = 'MOVING';
      else if (rand < 0.92) typeKey = 'FRAGILE';
      else typeKey = 'SPRING';
    }
    S.platforms.push(createPlatform(px, currentY, typeKey, 0));
  }
}

function ensurePlatformsAbove() {
  var minY = Infinity;
  for (var i = 0; i < S.platforms.length; i++) {
    if (!S.platforms[i].broken && S.platforms[i].y < minY) minY = S.platforms[i].y;
  }
  var topEdge = S.cameraY - 150;
  var diff = getDifficulty();
  while (minY > topEdge) {
    if (S.platforms.length >= C.MAX_PLATFORMS) {
      var maxY = -Infinity, maxIdx = 0;
      for (var pi = 0; pi < S.platforms.length; pi++) {
        if (S.platforms[pi].y > maxY) { maxY = S.platforms[pi].y; maxIdx = pi; }
      }
      S.platforms.splice(maxIdx, 1);
    }
    var minGap = 50 + diff * 18;
    var maxGap = Math.min(130, 90 + diff * 28);
    var gap = minGap + Math.random() * (maxGap - minGap);
    var newY = minY - gap;
    var margin = Math.max(15, 25 - diff * 6);
    var px = margin + Math.random() * (S.WIDTH - margin * 2);
    var typeKey = 'NORMAL';
    var rand = Math.random();
    if (diff >= 3) {
      if (rand < 0.10) typeKey = 'NORMAL';
      else if (rand < 0.38) typeKey = 'MOVING';
      else if (rand < 0.68) typeKey = 'FRAGILE';
      else if (rand < 0.88) typeKey = 'SPRING';
      else typeKey = 'JETPACK';
    } else if (diff >= 2) {
      if (rand < 0.20) typeKey = 'NORMAL';
      else if (rand < 0.45) typeKey = 'MOVING';
      else if (rand < 0.72) typeKey = 'FRAGILE';
      else if (rand < 0.90) typeKey = 'SPRING';
      else typeKey = 'JETPACK';
    } else if (diff >= 1) {
      if (rand < 0.32) typeKey = 'NORMAL';
      else if (rand < 0.55) typeKey = 'MOVING';
      else if (rand < 0.78) typeKey = 'FRAGILE';
      else if (rand < 0.93) typeKey = 'SPRING';
      else typeKey = 'JETPACK';
    } else {
      if (rand < 0.48) typeKey = 'NORMAL';
      else if (rand < 0.68) typeKey = 'MOVING';
      else if (rand < 0.85) typeKey = 'FRAGILE';
      else if (rand < 0.94) typeKey = 'SPRING';
      else typeKey = 'JETPACK';
    }
    S.platforms.push(createPlatform(px, newY, typeKey, diff));
    minY = newY;
  }
}

var rescueCooldown = 0;
function checkRescue() {
  var p = S.player;
  if (!p.onPlatform || p.jetpackActive) return;
  rescueCooldown -= 0.016;
  if (rescueCooldown > 0) return;

  var playerTop = p.y - p.height / 2;
  var nearestDist = Infinity;
  for (var i = 0; i < S.platforms.length; i++) {
    var plat = S.platforms[i];
    if (plat.broken || plat === p.onPlatform) continue;
    var platTop = plat.y - plat.height / 2;
    if (platTop < playerTop) {
      var dist = playerTop - platTop;
      if (dist < nearestDist) nearestDist = dist;
    }
  }

  if (nearestDist > 140) {
    var rescueY = playerTop - nearestDist / 2;
    var rescuePlat = createPlatform(p.x, rescueY, 'JETPACK', getDifficulty());
    S.platforms.push(rescuePlat);
    rescueCooldown = 3;
  }
}

// -------- 粒子 --------
function spawnParticles(x, y, color, count, spread) {
  color = color || '#555'; count = count || 8; spread = spread || 2.5;
  for (var i = 0; i < count && S.particles.length < C.MAX_PARTICLES; i++) {
    var angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
    var speed = 1.5 + Math.random() * spread;
    S.particles.push({
      x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 1, decay: 0.03 + Math.random() * 0.06, size: 2 + Math.random() * 3, color: color
    });
  }
}

function spawnFragileBreakParticles(x, y) {
  var colors = ['#555', '#666', '#777'];
  for (var i = 0; i < 12 && S.particles.length < C.MAX_PARTICLES; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = 2 + Math.random() * 5;
    S.particles.push({
      x: x + (Math.random() - 0.5) * 50, y: y + (Math.random() - 0.5) * 8,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2,
      life: 1, decay: 0.02 + Math.random() * 0.05, size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      isFragment: true, rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.3
    });
  }
}

function updateParticles() {
  for (var i = 0; i < S.particles.length; i++) {
    var p = S.particles[i];
    p.x += p.vx; p.y += p.vy;
    if (!p.isFragment) p.vy += 0.1; else p.vy += 0.25;
    p.life -= p.decay;
    if (p.rotSpeed) p.rotation += p.rotSpeed;
  }
  S.particles = S.particles.filter(function(p) { return p.life > 0; });
}

// -------- 收集品 --------
function spawnCollectible() {
  var types = ['coin', 'buff', 'shard', 'speed', 'effect'];
  var type = types[Math.floor(Math.random() * types.length)];
  var x = 40 + Math.random() * (S.WIDTH - 80);
  var y = S.cameraY - 40 - Math.random() * 30;
  var icon;
  switch (type) {
    case 'coin': icon = '🪙'; break;
    case 'buff': icon = '✨'; break;
    case 'shard': icon = '💎'; break;
    case 'speed': icon = '⚡'; break;
    case 'effect': icon = '🌟'; break;
  }
  S.collectibles.push({
    x: x, y: y, type: type, icon: icon, radius: 18,
    collected: false, animScale: 1, animPhase: 0
  });
}

function collectItem(item) {
  if (item.collected) return;
  item.collected = true;
  item.animPhase = 1;
  item.animDuration = 0.4;
  item.animTimer = 0;

  var mult = getScoreMultiplier();
  switch (item.type) {
    case 'coin':
      S.coins++;
      S.score += Math.floor(15 * mult);
      spawnParticles(item.x, item.y, '#ffd700', 10, 3);
      spawnFloatingText(item.x, item.y, '+' + Math.floor(15 * mult), '#ffd700');
      break;
    case 'buff':
      S.player.vy = S.player.jumpSpeed * 1.6;
      spawnParticles(item.x, item.y, '#c084fc', 14, 4);
      S.score += Math.floor(20 * mult);
      spawnFloatingText(item.x, item.y, 'BUFF!', '#c084fc');
      break;
    case 'shard':
      S.skinShards++;
      S.score += Math.floor(25 * mult);
      spawnParticles(item.x, item.y, '#22d3ee', 10, 3);
      spawnFloatingText(item.x, item.y, '+' + Math.floor(25 * mult), '#22d3ee');
      break;
    case 'speed':
      S.activeSpeedBoost = true; S.speedBoostTimer = 5.0; S.player.speedBoostMultiplier = 2.0;
      spawnParticles(item.x, item.y, '#facc15', 16, 5);
      S.score += Math.floor(10 * mult);
      spawnFloatingText(item.x, item.y, 'SPEED!', '#facc15');
      break;
    case 'effect':
      for (var i = 0; i < 20 && S.particles.length < C.MAX_PARTICLES; i++) {
        S.particles.push({
          x: item.x, y: item.y,
          vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.8) * 6 - 2,
          life: 1, decay: 0.03 + Math.random() * 0.05, size: 3 + Math.random() * 6, color: '#f472b6'
        });
      }
      S.score += Math.floor(5 * mult);
      spawnFloatingText(item.x, item.y, '✨', '#f472b6');
      break;
  }
}

function updateCollectibleAnims(dt) {
  for (var i = 0; i < S.collectibles.length; i++) {
    var c = S.collectibles[i];
    if (c.collected) {
      c.animTimer += dt;
      var t = Math.min(1, c.animTimer / c.animDuration);
      if (t < 0.3) c.animScale = 1 + t / 0.3 * 0.8;
      else if (t < 1) c.animScale = 1.8 - (t - 0.3) / 0.7 * 0.8;
      if (c.animTimer >= c.animDuration) {
        S.collectibles.splice(i, 1);
        i--;
      }
    }
  }
  S.collectibles = S.collectibles.filter(function(c) { return c.y < S.cameraY + S.HEIGHT + 50; });
}

function updateCollectibles() {
  for (var i = 0; i < S.collectibles.length; i++) {
    if (!S.collectibles[i].collected) S.collectibles[i].y += 0.6;
  }
  S.collectibles = S.collectibles.filter(function(c) { return c.y < S.cameraY + S.HEIGHT + 50 || c.collected; });
}

// -------- 碰撞检测 --------
function checkPlatformCollision() {
  var p = S.player;
  if (p.vy < 0) { p.onPlatform = null; return false; }
  var playerBottom = p.y + p.height / 2;
  var playerLeft = p.x - p.width / 2;
  var playerRight = p.x + p.width / 2;
  var prevBottom = playerBottom - p.vy;
  var bestPlatform = null, bestY = Infinity;
  for (var i = 0; i < S.platforms.length; i++) {
    var plat = S.platforms[i];
    if (plat.broken) continue;
    var platTop = plat.y - plat.height / 2;
    var platLeft = plat.x - plat.width / 2, platRight = plat.x + plat.width / 2;
    if (playerRight > platLeft - 8 && playerLeft < platRight + 8 &&
        playerBottom >= platTop - 4 && prevBottom <= platTop + 6 && playerBottom <= platTop + 18) {
      if (platTop < bestY) { bestY = platTop; bestPlatform = plat; }
    }
  }
  if (bestPlatform) {
    p.y = bestY - p.height / 2;
    p.onPlatform = bestPlatform;

    var isNewPlatform = bestPlatform !== S.lastPlatform;

    // 只有踩到不同的平台才加分 (防止原地跳重复得分)
    if (isNewPlatform) {
      var heightGain = Math.floor((S.lastPlatformY - bestY) / 10);
      if (heightGain > 0) S.score += heightGain * getScoreMultiplier();
      S.lastPlatform = bestPlatform;
      S.lastPlatformY = bestY;

      var mult = getScoreMultiplier();
      if (bestPlatform.typeDef.hasSpring) {
        S.score += Math.floor(30 * mult);
      } else if (bestPlatform.typeDef.hasJetpack && !bestPlatform.jetpackCollected) {
        S.score += Math.floor(45 * mult);
      } else if (bestPlatform.typeDef.fragile) {
        S.score += Math.floor(35 * mult);
      } else {
        var pts = (bestPlatform.type === 'MOVING') ? 20 : 10;
        S.score += Math.floor(pts * mult);
      }
    }

    // 平台效果: 总是生效
    if (bestPlatform.typeDef.hasSpring) {
      p.vy = p.jumpSpeed * 1.45;
      bestPlatform.springCompressed = true; bestPlatform.springTimer = 0.2;
      spawnParticles(p.x, bestY, '#f4c430', 16, 4);
      spawnFloatingText(p.x, bestY - 20, '+BOING!', '#f4c430');
      triggerShake('heavy');
    } else if (bestPlatform.typeDef.hasJetpack && !bestPlatform.jetpackCollected) {
      p.vy = p.jumpSpeed;
      bestPlatform.jetpackCollected = true;
      p.jetpackActive = true; p.jetpackTimer = 2.5; p.jetpackFuel = 1.2;
      spawnParticles(p.x, bestY, '#4499ee', 18, 5);
      spawnFloatingText(p.x, bestY - 20, '🚀', '#4499ee');
      triggerShake('medium');
    } else if (bestPlatform.typeDef.fragile) {
      p.vy = p.jumpSpeed;
      bestPlatform.broken = true; bestPlatform.flashTimer = 0.15;
      spawnFragileBreakParticles(bestPlatform.x, bestPlatform.y);
      spawnParticles(p.x, bestY, '#e8734a', 10, 3);
      spawnFloatingText(p.x, bestY - 20, 'CRACK!', '#e8734a');
      triggerShake('medium');
      p.onPlatform = null;
    } else {
      p.vy = p.jumpSpeed;
      spawnParticles(p.x, bestY, '#ccc', 6, 2);
      triggerShake('light');
    }
    p.squashTimer = 0.15;
    S.fallTimer = 0;

    // 连击
    S.combo++;
    S.comboTimer = C.COMBO_TIMEOUT;
    if (S.combo > S.maxCombo) S.maxCombo = S.combo;
    if (S.combo >= 3) {
      var comboBonus = (S.combo - 2) * C.COMBO_BONUS;
      S.score += comboBonus;
      spawnFloatingText(p.x, bestY - 35, 'COMBO x' + S.combo + '!', '#ff6b6b');
    }
    if (isNewPlatform && !bestPlatform.typeDef.hasSpring && !bestPlatform.typeDef.hasJetpack) {
      var ptLabel = bestPlatform.type === 'MOVING' ? 20 : 10;
      spawnFloatingText(p.x, bestY - 12, '+' + Math.floor(ptLabel * mult), '#555');
    }

    return true;
  }
  p.onPlatform = null;
  return false;
}

function checkCollectibleCollision() {
  var p = S.player;
  for (var i = 0; i < S.collectibles.length; i++) {
    var c = S.collectibles[i];
    if (c.collected) continue;
    var dx = p.x - c.x;
    var dy = (p.y - p.height / 4) - c.y;
    if (Math.sqrt(dx * dx + dy * dy) < p.width / 2 + c.radius) collectItem(c);
  }
}

function updateMovingPlatforms(dt) {
  for (var i = 0; i < S.platforms.length; i++) {
    var plat = S.platforms[i];
    if (plat.broken || !plat.typeDef.moving) continue;
    plat.movePhase += plat.moveSpeed * dt * 3;
    var offset = Math.sin(plat.movePhase) * plat.moveAmplitude;
    var dx = (plat.moveCenterX + offset) - plat.x;
    plat.x = plat.moveCenterX + offset;
    if (S.player.onPlatform === plat && S.player.vy >= -1) S.player.x += dx;
  }
}

function updatePlatformAnimations(dt) {
  for (var i = 0; i < S.platforms.length; i++) {
    var plat = S.platforms[i];
    if (plat.springTimer > 0) plat.springTimer -= dt;
    if (plat.flashTimer > 0) plat.flashTimer -= dt;
  }
}

function updateRewardTimer(dt) {
  if (S.gameState !== C.STATE.PLAYING) return;
  S.nextRewardTime -= dt * 1000;
  if (S.nextRewardTime <= 0) {
    if (S.collectibles.length < 3) spawnCollectible();
    S.nextRewardTime = C.REWARD_INTERVAL_MIN + Math.random() * (C.REWARD_INTERVAL_MAX - C.REWARD_INTERVAL_MIN);
  }
}

function updateSpeedBoost(dt) {
  if (S.activeSpeedBoost && S.speedBoostTimer > 0) {
    S.speedBoostTimer -= dt;
    if (S.speedBoostTimer <= 0) { S.activeSpeedBoost = false; S.player.speedBoostMultiplier = 1.0; }
  }
}

function updateFloatingTexts(dt) {
  for (var i = 0; i < S.floatingTexts.length; i++) {
    var ft = S.floatingTexts[i];
    ft.y += ft.vy * dt * 60;
    ft.life -= dt * 0.9;
  }
  S.floatingTexts = S.floatingTexts.filter(function(ft) { return ft.life > 0; });
}

function updateShake(dt) {
  if (S.shakeAmount > 0.1) {
    S.shakeAmount *= Math.pow(0.08, dt);
  } else {
    S.shakeAmount = 0;
  }
}

function updateCombo(dt) {
  if (S.comboTimer > 0) {
    S.comboTimer -= dt;
    if (S.comboTimer <= 0) S.combo = 0;
  }
}

J.platform = {
  getDifficulty: getDifficulty,
  getScoreMultiplier: getScoreMultiplier,
  createPlatform: createPlatform,
  generateInitialPlatforms: generateInitialPlatforms,
  ensurePlatformsAbove: ensurePlatformsAbove,
  spawnParticles: spawnParticles,
  updateParticles: updateParticles,
  spawnCollectible: spawnCollectible,
  collectItem: collectItem,
  updateCollectibleAnims: updateCollectibleAnims,
  updateCollectibles: updateCollectibles,
  updateRewardTimer: updateRewardTimer,
  updateSpeedBoost: updateSpeedBoost,
  updateFloatingTexts: updateFloatingTexts,
  updateShake: updateShake,
  updateCombo: updateCombo,
  checkPlatformCollision: checkPlatformCollision,
  checkCollectibleCollision: checkCollectibleCollision,
  updateMovingPlatforms: updateMovingPlatforms,
  updatePlatformAnimations: updatePlatformAnimations,
  checkRescue: checkRescue,
  triggerShake: triggerShake
};
