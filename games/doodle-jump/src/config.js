// config.js - 游戏常量 & 角色皮肤 & 平台类型定义
var J = window.J = window.J || {};

var DESIGN_W = 420;
var DESIGN_H = 680;

var STATE = { MENU: 'menu', PLAYING: 'playing', REVIVE: 'revive', GAMEOVER: 'gameover', INTERSTITIAL: 'interstitial' };

var CHARACTERS = [
  {
    name: '经典蜥蜴', id: 'lizard',
    draw: function(ctx, player, inputDir) {
      var w = player.width, h = player.height;
      var antDir = inputDir !== 0 ? inputDir * 0.5 : (player.facingRight ? 0.3 : -0.3);
      ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
      for (var side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        var bx = side * 8, by = -h / 2 + 4;
        ctx.moveTo(bx, by);
        var tx = bx + side * 8 + antDir * 8, ty = by - 16;
        ctx.quadraticCurveTo(bx + side * 5, by - 10, tx, ty);
        ctx.stroke();
        ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#111';
        ctx.beginPath(); ctx.arc(tx, ty, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#f0f0f0'; ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 2, w / 2 - 1, h / 2 - 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      var eyeY = -h / 6;
      for (var side = -1; side <= 1; side += 2) {
        var ex = side * 9;
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ex, eyeY, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(ex + inputDir * 2 + (player.facingRight ? 1 : -1), eyeY + 1, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      var footY = h / 2 - 5;
      for (var side = -1; side <= 1; side += 2) {
        ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(side * 10, footY, 7, 4.5, 0.2 * side, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }
  },
  {
    name: '探险家', id: 'explorer',
    draw: function(ctx, player, inputDir) {
      var w = player.width, h = player.height;
      ctx.fillStyle = '#ccc'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, -h / 2 - 5, w / 3, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#bbb';
      ctx.beginPath(); ctx.ellipse(0, -h / 2 - 12, w / 4, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f0f0f0'; ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 2, w / 2 - 1, h / 2 - 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-10, -h / 4); ctx.lineTo(-14, h / 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, -h / 4); ctx.lineTo(14, h / 4); ctx.stroke();
      var eyeY = -h / 6;
      for (var side = -1; side <= 1; side += 2) {
        var ex = side * 9;
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ex, eyeY, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(ex + inputDir * 2 + (player.facingRight ? 1 : -1), eyeY + 1, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      var footY = h / 2 - 5;
      for (var side = -1; side <= 1; side += 2) {
        ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(side * 10, footY, 7, 4.5, 0.2 * side, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }
  },
  {
    name: '小飞龙', id: 'dragon',
    draw: function(ctx, player, inputDir) {
      var w = player.width, h = player.height;
      ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
      for (var side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        ctx.moveTo(side * 12, -h / 3);
        ctx.quadraticCurveTo(side * 25, -h / 2, side * 30, -h / 3 - 5);
        ctx.quadraticCurveTo(side * 15, -h / 4, side * 12, -h / 6);
        ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#f0f0f0'; ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 2, w / 2 - 1, h / 2 - 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      var eyeY = -h / 6;
      for (var side = -1; side <= 1; side += 2) {
        var ex = side * 9;
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ex, eyeY, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(ex + inputDir * 2 + (player.facingRight ? 1 : -1), eyeY + 1, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0, h / 3); ctx.quadraticCurveTo(15, h / 2 + 5, 22, h / 2 - 2); ctx.stroke();
      var footY = h / 2 - 5;
      for (var side = -1; side <= 1; side += 2) {
        ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(side * 10, footY, 7, 4.5, 0.2 * side, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }
  },
  {
    name: '兔耳', id: 'bunny',
    draw: function(ctx, player, inputDir) {
      var w = player.width, h = player.height;
      ctx.fillStyle = '#f0f0f0'; ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
      for (var side = -1; side <= 1; side += 2) {
        ctx.beginPath(); ctx.ellipse(side * 8, -h / 2 - 10, 7, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.ellipse(side * 8, -h / 2 - 10, 4, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f0f0f0';
      }
      ctx.fillStyle = '#f0f0f0'; ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 2, w / 2 - 1, h / 2 - 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      var eyeY = -h / 6;
      for (var side = -1; side <= 1; side += 2) {
        var ex = side * 9;
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ex, eyeY, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(ex + inputDir * 2 + (player.facingRight ? 1 : -1), eyeY + 1, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      var footY = h / 2 - 5;
      for (var side = -1; side <= 1; side += 2) {
        ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(side * 10, footY, 7, 4.5, 0.2 * side, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }
  }
];

var PLATFORM_TYPES = {
  NORMAL:  { name: 'normal',  fill: '#ddd', stroke: '#222', bounceMultiplier: 1,    points: 10 },
  MOVING:  { name: 'moving',  fill: '#ccc', stroke: '#222', bounceMultiplier: 1,    points: 15, moving: true },
  FRAGILE: { name: 'fragile', fill: '#e0e0e0', stroke: '#222', bounceMultiplier: 1,    points: 20, fragile: true },
  SPRING:  { name: 'spring',  fill: '#bbb', stroke: '#111', bounceMultiplier: 1.45, points: 25, hasSpring: true },
  JETPACK: { name: 'jetpack', fill: '#c0c0c0', stroke: '#111', bounceMultiplier: 1,    points: 30, hasJetpack: true }
};

var REWARD_INTERVAL_MIN = 5000;
var REWARD_INTERVAL_MAX = 10000;
var MAX_FALL_TIME = 2.0;
var MAX_PLATFORMS = 45;
var MAX_PARTICLES = 100;
var INTERSTITIAL_INTERVAL = 3;
var COMBO_TIMEOUT = 1.2;
var COMBO_BONUS = 5;

var SHAKE = { light: 2, medium: 4, heavy: 6 };
var AD_UNIT_IDS = { rewarded: '', interstitial: '', banner: '' };

J.config = {
  DESIGN_W: DESIGN_W,
  DESIGN_H: DESIGN_H,
  STATE: STATE,
  CHARACTERS: CHARACTERS,
  PLATFORM_TYPES: PLATFORM_TYPES,
  REWARD_INTERVAL_MIN: REWARD_INTERVAL_MIN,
  REWARD_INTERVAL_MAX: REWARD_INTERVAL_MAX,
  MAX_FALL_TIME: MAX_FALL_TIME,
  MAX_PLATFORMS: MAX_PLATFORMS,
  MAX_PARTICLES: MAX_PARTICLES,
  INTERSTITIAL_INTERVAL: INTERSTITIAL_INTERVAL,
  COMBO_TIMEOUT: COMBO_TIMEOUT,
  COMBO_BONUS: COMBO_BONUS,
  SHAKE: SHAKE,
  AD_UNIT_IDS: AD_UNIT_IDS
};
