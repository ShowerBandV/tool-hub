// main.js - 入口: 初始化、游戏循环、状态切换
var J = window.J || {};
var C = J.config;
var S = J.state;
var P = J.platform;
var R = J.render;
var I = J.input;

// 获取 canvas 并注入状态
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
S.canvas = canvas;
S.ctx = ctx;

// roundRect polyfill
if (!ctx.roundRect) {
  ctx.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
  };
}

// 屏幕适配
function resizeCanvas() {
  canvas.width = C.DESIGN_W;
  canvas.height = C.DESIGN_H;
  S.scaleX = 1;
  S.scaleY = 1;
  S.WIDTH = C.DESIGN_W;
  S.HEIGHT = C.DESIGN_H;
}
resizeCanvas();

// 存档
try {
  var savedBest = localStorage.getItem('doodleJumpBestScore');
  if (savedBest) S.bestScore = parseInt(savedBest, 10) || 0;
  var savedGames = localStorage.getItem('doodleJumpGamesPlayed');
  if (savedGames) S.gamesPlayed = parseInt(savedGames, 10) || 0;
} catch (e) { S.bestScore = 0; S.gamesPlayed = 0; }

function saveBestScore() {
  if (S.score > S.bestScore) {
    S.bestScore = S.score;
    try { localStorage.setItem('doodleJumpBestScore', S.bestScore); } catch (e) {}
  }
}

function incrementGamesPlayed() {
  S.gamesPlayed++;
  try { localStorage.setItem('doodleJumpGamesPlayed', S.gamesPlayed); } catch (e) {}
}

// 玩家重置
function resetPlayer() {
  var p = S.player;
  p.x = S.WIDTH / 2; p.y = S.HEIGHT - 200; p.vy = 0; p.vx = 0;
  p.onPlatform = null; p.facingRight = true; p.squashTimer = 0;
  p.trailPositions = []; p.jetpackActive = false; p.jetpackTimer = 0;
  p.jetpackFuel = 0; p.speedBoostMultiplier = 1.0;
}

function updateJetpack(dt) {
  var p = S.player;
  if (p.jetpackActive && p.jetpackTimer > 0) {
    p.jetpackTimer -= dt;
    if (p.jetpackFuel > 0) { p.vy = -10; p.jetpackFuel -= dt; }
    else p.jetpackActive = false;
  } else { p.jetpackActive = false; p.jetpackFuel = 0; }
}

// ============ 游戏流程 ============
function endGame() {
  if (S.gameState !== C.STATE.PLAYING) return;
  incrementGamesPlayed();
  saveBestScore();
  S.gameState = C.STATE.GAMEOVER;
  P.spawnParticles(S.player.x, S.player.y, '#111', 20);
  S.player.vy = 0; S.player.vx = 0;
}

function startGame() {
  S.gameState = C.STATE.PLAYING;
  S.score = 0;
  S.difficultyBase = 0;
  resetPlayer();
  S.platforms = []; S.particles = []; S.collectibles = [];
  S.activeSpeedBoost = false; S.speedBoostTimer = 0;
  S.fallTimer = 0;
  S.lastPlatform = null;
  S.lastPlatformId = 0; S.lastScoredY = undefined;
  S.combo = 0; S.comboTimer = 0; S.maxCombo = 0;
  S.floatingTexts = [];
  S.shakeAmount = 0;
  S.jetpackCooldown = 0;
  // Reset platform ID counter
  platformIdCounter = 0;
  P.generateInitialPlatforms();
  if (S.platforms.length > 0) {
    var sp = S.platforms[0];
    var p = S.player;
    p.x = sp.x; p.y = sp.y - sp.height / 2 - p.height / 2;
    p.vy = 0; p.onPlatform = sp;
  }
  S.cameraY = S.player.y - S.HEIGHT * 0.35;
  S.highestReachedY = S.player.y;
  if (S.platforms.length > 0) {
    S.lastPlatformY = S.platforms[0].y - S.platforms[0].height / 2;
  }
  S.lastTime = Date.now();

  updateDOMScore();
}

function restartGame() { startGame(); }

// 直接使用喷气背包 (无广告, 30s冷却)
function activateJetpack() {
  if (S.jetpackCooldown > 0 || S.gameState !== C.STATE.PLAYING) return;
  var p = S.player;
  p.jetpackActive = true; p.jetpackTimer = 1.8; p.jetpackFuel = 0.9;
  p.vy = p.jumpSpeed * 1.3;
  P.spawnParticles(p.x, p.y, '#111', 12);
  S.jetpackCooldown = C.JETPACK_COOLDOWN;
}

// ============ 主更新 ============
function updateCamera() {
  S.cameraY = S.player.y - S.HEIGHT * 0.35;
}

function update() {
  var now = Date.now();
  var dt = (now - S.lastTime) / 1000;
  if (dt > 0.1) dt = 0.1;
  if (dt <= 0) dt = 0.016;
  S.lastTime = now;

  if (S.gameState !== C.STATE.PLAYING) return;

  // 防止 NaN 导致游戏永久卡死
  var p = S.player;
  if (!isFinite(p.x) || !isFinite(p.y)) {
    endGame();
    return;
  }

  P.updateSpeedBoost(dt);
  P.updateShake(dt);
  P.updateFloatingTexts(dt);
  P.updateCombo(dt);
  updateJetpack(dt);
  if (S.jetpackCooldown > 0) S.jetpackCooldown -= dt;

  var p = S.player;
  var targetVx = S.inputDirection * p.moveSpeed * p.speedBoostMultiplier;
  p.vx += (targetVx - p.vx) * Math.min(1, dt * 18);
  p.x += p.vx * dt * 60;

  if (p.x < -p.width / 2) p.x = S.WIDTH + p.width / 2 - 2;
  else if (p.x > S.WIDTH + p.width / 2) p.x = -p.width / 2 + 2;

  if (!p.jetpackActive || p.jetpackFuel <= 0) p.vy += p.gravity * dt * 60;
  if (p.vy > 16) p.vy = 16;
  p.y += p.vy * dt * 60;

  P.updateMovingPlatforms(dt);
  P.checkPlatformCollision();
  P.updatePlatformAnimations(dt);
  updateCamera();
  P.ensurePlatformsAbove();
  P.checkRescue();

  if (p.vy > 0 && !p.onPlatform) S.fallTimer += dt;
  if (S.fallTimer >= C.MAX_FALL_TIME) { endGame(); return; }

  if (p.vy < -3 || p.jetpackActive)
    p.trailPositions.push({ x: p.x, y: p.y, life: 1 });
  for (var i = 0; i < p.trailPositions.length; i++) {
    p.trailPositions[i].life -= dt * 3;
  }
  p.trailPositions = p.trailPositions.filter(function(t) { return t.life > 0; });
  if (p.trailPositions.length > 15) p.trailPositions.shift();

  P.updateParticles();

  for (var i = 0; i < S.platforms.length; i++) {
    var plat = S.platforms[i];
    if (plat.particles.length > 0) {
      for (var j = 0; j < plat.particles.length; j++) {
        var pp = plat.particles[j];
        pp.x += pp.vx; pp.y += pp.vy; pp.vy += 0.3;
        pp.life -= pp.decay || 0.04;
      }
      plat.particles = plat.particles.filter(function(pp) { return pp.life > 0; });
    }
  }
  if (p.squashTimer > 0) p.squashTimer -= dt;

  updateDOMScore();

  if (p.y > S.cameraY + S.HEIGHT + 60) endGame();
}

function updateDOMScore() {
  var scoreEl = document.getElementById('scoreDisplay');
  var bestEl = document.getElementById('bestScoreDisplay');
  var buffBar = document.getElementById('buffBar');
  var buffTimer = document.getElementById('buffTimer');

  if (scoreEl) scoreEl.textContent = S.score;
  if (bestEl) bestEl.textContent = S.bestScore;

  if (buffBar && buffTimer) {
    if (S.activeSpeedBoost && S.speedBoostTimer > 0) {
      buffBar.style.display = 'flex';
      buffTimer.textContent = Math.ceil(S.speedBoostTimer);
    } else {
      buffBar.style.display = 'none';
    }
  }
}

// 游戏循环
function gameLoop() {
  try {
    update();
    R.render();
  } catch (e) {
    // 防止单帧异常导致游戏卡死
    S.gameState = C.STATE.GAMEOVER;
  }
  requestAnimationFrame(gameLoop);
}

// 初始化 & 启动
function init() {
  resetPlayer();
  S.platforms = []; S.particles = []; S.collectibles = [];
  S.cameraY = 0; S.highestReachedY = S.HEIGHT - 200;
  S.score = 0; S.fallTimer = 0;
  S.difficultyBase = 0; S.lastPlatform = null;
  S.lastPlatformId = 0; S.lastScoredY = undefined;
  S.combo = 0; S.comboTimer = 0; S.maxCombo = 0;
  S.floatingTexts = [];
  S.shakeAmount = 0;
  S.jetpackCooldown = 0;
  platformIdCounter = 0;
  S.gameState = C.STATE.MENU;
  P.generateInitialPlatforms();
  if (S.platforms.length > 0) {
    var sp = S.platforms[0];
    var p = S.player;
    p.x = sp.x; p.y = sp.y - sp.height / 2 - p.height / 2; p.vy = 0; p.onPlatform = sp;
  }
  S.activeSpeedBoost = false; S.speedBoostTimer = 0;
  S.lastTime = Date.now();

  updateDOMScore();
}

I.initInput(startGame, restartGame, activateJetpack);
init();
gameLoop();
// 隐藏加载动画
var loader = document.getElementById('loadingOverlay');
if (loader) { loader.classList.add('hidden'); }
