// platform.js - 平台生成、更新、碰撞 & 粒子 & 特效
var J = window.J || {};
var C = J.config;
var S = J.state;

function getDifficulty() {
  return Math.min(1, S.score / 8000);
}

function getScoreMultiplier() {
  return 1 + Math.floor(S.score / 3000) * 0.5;
}

function triggerShake(intensity) {
  S.shakeAmount = Math.max(S.shakeAmount, intensity);
}

function spawnFloatingText(x, y, text, color) {
  if (S.floatingTexts.length > 30) return;
  S.floatingTexts.push({ x: x, y: y, text: text, color: color, vy: -1.5, life: 1.5 });
}

// -------- 基础平台类型定义 --------
var BASE_TYPES = C.PLATFORM_TYPES;
var platformIdCounter = 0;

function createPlatform(x, y, forcedType) {
  var diff = getDifficulty();
  var typeDef;
  if (forcedType) {
    typeDef = forcedType;
  } else {
    var r = Math.random();
    if (diff > 0.6 && r < 0.12) typeDef = BASE_TYPES.BROKEN;
    else if (diff > 0.4 && r < 0.22) typeDef = BASE_TYPES.MOVING;
    else if (r < 0.08) typeDef = BASE_TYPES.SPRING;
    else if (r < 0.05) typeDef = BASE_TYPES.JETPACK;
    else typeDef = BASE_TYPES.NORMAL;
  }

  var w = typeDef.width || 65;
  var h = typeDef.height || 14;

  var plat = {
    id: ++platformIdCounter,
    x: x, y: y, width: w, height: h,
    typeDef: typeDef,
    broken: false,
    springTimer: 0,
    flashTimer: 0,
    particles: [],
    movePhase: Math.random() * Math.PI * 2,
    moveSpeed: 0.8 + Math.random() * 1.5,
    moveAmplitude: 30 + Math.random() * 60,
    moveCenterX: x
  };

  if (typeDef.moving) {
    plat.moveAmplitude = 30 + Math.random() * 70;
    plat.moveSpeed = 1.2 + Math.random() * 2;
    plat.moveCenterX = x;
  }

  return plat;
}

function generateInitialPlatforms() {
  S.platforms = [];
  var startY = S.HEIGHT - 120;
  // Guarantee at least one platform under the player
  S.platforms.push(createPlatform(S.WIDTH / 2, startY, BASE_TYPES.NORMAL));
  for (var i = 0; i < 15; i++) {
    var x = 40 + Math.random() * (S.WIDTH - 80);
    var y = startY - i * 45 - Math.random() * 20;
    S.platforms.push(createPlatform(x, y));
  }
  S.lastPlatformY = startY;
}

function ensurePlatformsAbove() {
  // 找到当前最高的平台（最小 y 值）
  var highestY = Infinity;
  for (var i = 0; i < S.platforms.length; i++) {
    if (!S.platforms[i].broken && S.platforms[i].y < highestY) {
      highestY = S.platforms[i].y;
    }
  }
  if (!isFinite(highestY)) highestY = S.player.y;

  // 目标：在玩家上方至少 200px 要有平台（覆盖弹簧跳跃 260px 的大部分）
  var targetTop = S.player.y - 200;
  if (S.cameraY - 100 < targetTop) targetTop = S.cameraY - 100;

  // 从最高平台向上生成，间距加大
  var y = highestY;
  var count = 0;
  while (y > targetTop && count < 60) {
    y -= 52 + Math.random() * 32; // 间距 52~84，比之前稀疏
    if (y < targetTop - 120) break;
    var x = 30 + Math.random() * (S.WIDTH - 60);
    S.platforms.push(createPlatform(x, y));
    S.lastPlatformY = y;
    count++;
  }

  // 移除屏幕下方很远的平台
  S.platforms = S.platforms.filter(function(p) {
    return p.y < S.cameraY + S.HEIGHT + 100;
  });

  // 安全移除多余平台：优先移除最下方（y 最大）
  while (S.platforms.length > C.MAX_PLATFORMS) {
    var worstIdx = -1;
    var worstY = -Infinity;
    for (var j = 0; j < S.platforms.length; j++) {
      // 跳过玩家正站着的平台
      if (S.platforms[j] === S.player.onPlatform) continue;
      if (S.platforms[j].y > worstY) {
        worstY = S.platforms[j].y;
        worstIdx = j;
      }
    }
    if (worstIdx >= 0) S.platforms.splice(worstIdx, 1);
    else break;
  }
}

// -------- 粒子 --------
function spawnParticles(x, y, color, count, vxRange) {
  vxRange = vxRange || 3;
  for (var i = 0; i < count && S.particles.length < C.MAX_PARTICLES; i++) {
    S.particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * vxRange * 2,
      vy: -2 - Math.random() * 5,
      life: 1, decay: 0.025 + Math.random() * 0.045,
      size: 2 + Math.random() * 5, color: color
    });
  }
}

function updateParticles() {
  for (var i = 0; i < S.particles.length; i++) {
    var p = S.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= p.decay;
  }
  S.particles = S.particles.filter(function(p) { return p.life > 0; });
}

// -------- 碰撞检测 --------
function checkPlatformCollision() {
  var p = S.player;
  if (p.vy < 0) { p.onPlatform = null; return false; }
  var playerBottom = p.y + p.height / 2;
  var playerLeft = p.x - p.width / 2;
  var playerRight = p.x + p.width / 2;

  var bestDist = Infinity;
  var bestPlatform = null;

  for (var i = 0; i < S.platforms.length; i++) {
    var plat = S.platforms[i];
    if (plat.broken) continue;
    var platTop = plat.y - plat.height / 2;
    var platLeft = plat.x - plat.width / 2;
    var platRight = plat.x + plat.width / 2;

    if (playerBottom >= platTop && playerBottom <= plat.y + 5 &&
        playerRight >= platLeft && playerLeft <= platRight) {
      var dist = Math.abs(playerBottom - platTop);
      if (dist < bestDist && dist < 18) {
        bestDist = dist;
        bestPlatform = plat;
      }
    }
  }

  if (bestPlatform) {
    var plat = bestPlatform;
    var isNewPlatform = (S.lastPlatformId !== plat.id);
    // 只对更高的平台计分，防止原地跳加分
    var isHigherPlatform = (S.lastScoredY === undefined || plat.y < S.lastScoredY - 8);

    if (plat.typeDef.broken) {
      plat.broken = true;
      plat.flashTimer = 0.3;
      spawnParticles(plat.x, plat.y, '#ff6b6b', 12, 4);
      triggerShake(C.SHAKE.light);
      p.vy = p.jumpSpeed * 0.6;
      p.onPlatform = null;
      return false;
    }

    var jumpMult = plat.typeDef.bounceMultiplier || 1;
    if (plat.typeDef.hasSpring && isNewPlatform) {
      jumpMult = 1.65;
      plat.springTimer = 0.3;
      spawnParticles(plat.x, plat.y, '#ffd700', 8, 3);
    }
    if (plat.typeDef.hasJetpack && isNewPlatform) {
      p.jetpackActive = true;
      p.jetpackTimer = 2.5;
      p.jetpackFuel = 1.2;
      plat.springTimer = 0.3;
      spawnParticles(plat.x, plat.y, '#c084fc', 14, 5);
    }

    p.vy = p.jumpSpeed * jumpMult;
    p.y = plat.y - plat.height / 2 - p.height / 2;
    p.onPlatform = plat;
    S.fallTimer = 0;

    if (p.squashTimer <= 0 && isNewPlatform) {
      p.squashTimer = 0.12;
    }

    S.lastPlatformId = plat.id;

    if (isNewPlatform && isHigherPlatform) {
      S.lastScoredY = plat.y;
      var bonus = plat.typeDef.points || 0;
      if (bonus > 0) {
        S.score += bonus;
        spawnFloatingText(plat.x, plat.y - 10, '+' + bonus, '#ffd700');
      }
      S.combo++;
      S.comboTimer = C.COMBO_TIMEOUT;
      if (S.combo > S.maxCombo) S.maxCombo = S.combo;
      if (S.combo >= 3) {
        var comboBonus = (S.combo - 2) * C.COMBO_BONUS;
        S.score += comboBonus;
        spawnFloatingText(p.x, plat.y - 35, 'COMBO x' + S.combo + '!', '#ff6b6b');
      }
    } else if (!isNewPlatform) {
      S.combo = 0; S.comboTimer = 0;
    } else {
      // 新平台但不够高：重置连击计时器，但不增加连击
      S.comboTimer = C.COMBO_TIMEOUT;
    }

    return true;
  }

  p.onPlatform = null;
  return false;
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

// 检查是否掉出屏幕
function checkRescue() {
  var p = S.player;
  if (p.y > S.cameraY + S.HEIGHT + 40) {
    // Try to find a platform below to rescue
    var rescued = false;
    for (var i = 0; i < S.platforms.length; i++) {
      var plat = S.platforms[i];
      if (!plat.broken && plat.y > p.y && plat.y < p.y + 200) {
        p.y = plat.y - plat.height / 2 - p.height / 2;
        p.vy = p.jumpSpeed;
        p.onPlatform = plat;
        S.fallTimer = 0;
        rescued = true;
        break;
      }
    }
    return rescued;
  }
  return true;
}

J.platform = {
  getDifficulty: getDifficulty,
  getScoreMultiplier: getScoreMultiplier,
  createPlatform: createPlatform,
  generateInitialPlatforms: generateInitialPlatforms,
  ensurePlatformsAbove: ensurePlatformsAbove,
  spawnParticles: spawnParticles,
  updateParticles: updateParticles,
  updateSpeedBoost: updateSpeedBoost,
  updateFloatingTexts: updateFloatingTexts,
  updateShake: updateShake,
  updateCombo: updateCombo,
  checkPlatformCollision: checkPlatformCollision,
  updateMovingPlatforms: updateMovingPlatforms,
  updatePlatformAnimations: updatePlatformAnimations,
  checkRescue: checkRescue,
  triggerShake: triggerShake,
  spawnFloatingText: spawnFloatingText
};
