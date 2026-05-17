// state.js - 可变游戏状态 (所有模块共享此单一对象的引用)
var J = window.J || {};
var C = J.config;

var state = {
  canvas: null,
  ctx: null,

  WIDTH: C.DESIGN_W,
  HEIGHT: C.DESIGN_H,
  scaleX: 1,
  scaleY: 1,

  gameState: C.STATE.MENU,
  score: 0,
  bestScore: 0,
  coins: 0,
  skinShards: 0,
  cameraY: 0,
  highestReachedY: 0,

  lastTime: 0,
  fallTimer: 0,
  activeSpeedBoost: false,
  speedBoostTimer: 0,
  nextRewardTime: 0,

  inputDirection: 0,
  selectedCharacter: C.CHARACTERS[0],

  player: {
    x: C.DESIGN_W / 2, y: C.DESIGN_H - 200, width: 44, height: 50,
    vy: 0, vx: 0, moveSpeed: 5.5, jumpSpeed: -13.2, gravity: 0.55,
    onPlatform: null, facingRight: true, squashTimer: 0,
    trailPositions: [], jetpackActive: false, jetpackTimer: 0, jetpackFuel: 0,
    speedBoostMultiplier: 1.0
  },

  platforms: [],
  particles: [],
  collectibles: [],

  lastPlatform: null,
  lastPlatformY: 0,

  difficultyBase: 0,
  reviveCount: 0,

  adCooldown: 0,
  gamesPlayed: 0,
  shakeAmount: 0,
  floatingTexts: [],
  combo: 0,
  comboTimer: 0,
  maxCombo: 0
};

J.state = state;
