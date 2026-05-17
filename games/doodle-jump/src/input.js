// input.js - 触摸 & 键盘输入处理
var J = window.J || {};
var C = J.config;
var S = J.state;

var touchActive = false;
var touchX = 0;
var keys = {};

var canvas = null;

function screenToGameX(screenX) {
  return screenX / S.scaleX;
}
function screenToGameY(screenY) {
  return screenY / S.scaleY;
}

var handleMenuClick;
var startGameCallback;
var restartGameCallback;
var jetpackCallback;

function initInput(onStartGame, onRestartGame, onJetpack) {
  startGameCallback = onStartGame;
  restartGameCallback = onRestartGame;
  jetpackCallback = onJetpack;

  canvas = S.canvas;
  if (!canvas) return;

  handleMenuClick = function(mx, my) {
    var iconSize = 50;
    var startX = S.WIDTH / 2 - (C.CHARACTERS.length * (iconSize + 15)) / 2 + 15;
    var yPos = S.HEIGHT * 0.68;
    for (var i = 0; i < C.CHARACTERS.length; i++) {
      var cx = startX + i * (iconSize + 15);
      if (mx > cx - iconSize / 2 && mx < cx + iconSize / 2 &&
          my > yPos - iconSize / 2 && my < yPos + iconSize / 2) {
        S.selectedCharacter = C.CHARACTERS[i];
        return;
      }
    }
    startGameCallback();
  };

  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (!e.touches || e.touches.length === 0) return;
    var rect = canvas.getBoundingClientRect();
    var gx = (e.touches[0].clientX - rect.left) * (S.WIDTH / rect.width);
    var gy = (e.touches[0].clientY - rect.top) * (S.HEIGHT / rect.height);
    if (S.gameState === C.STATE.MENU) {
      handleMenuClick(gx, gy);
      return;
    }
    if (S.gameState === C.STATE.GAMEOVER) {
      restartGameCallback();
      return;
    }
    if (S.gameState === C.STATE.PLAYING) {
      var btnCX = S.WIDTH - 40, btnCY = S.HEIGHT - 40;
      if (Math.abs(gx - btnCX) < 30 && Math.abs(gy - btnCY) < 30) {
        jetpackCallback();
        return;
      }
    }
    touchActive = true;
    touchX = (e.touches[0].clientX - rect.left) * (S.WIDTH / rect.width);
    updateTouchDirection();
  }, { passive: false });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (!touchActive || !e.touches || e.touches.length === 0) return;
    var rect = canvas.getBoundingClientRect();
    touchX = (e.touches[0].clientX - rect.left) * (S.WIDTH / rect.width);
    updateTouchDirection();
  }, { passive: false });

  canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
    touchActive = false;
    S.inputDirection = 0;
  });

  canvas.addEventListener('touchcancel', function(e) {
    touchActive = false;
    S.inputDirection = 0;
  });

  canvas.addEventListener('click', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = (e.clientX - rect.left) * (S.WIDTH / rect.width);
    var my = (e.clientY - rect.top) * (S.HEIGHT / rect.height);
    if (S.gameState === C.STATE.MENU) {
      handleMenuClick(mx, my);
    } else if (S.gameState === C.STATE.GAMEOVER) {
      restartGameCallback();
    } else if (S.gameState === C.STATE.PLAYING) {
      var btnCX = S.WIDTH - 40, btnCY = S.HEIGHT - 40;
      if (Math.abs(mx - btnCX) < 30 && Math.abs(my - btnCY) < 30) {
        jetpackCallback();
      }
    }
  });

  window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    updateInputDirectionFromKeys();
    if (e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (S.gameState === C.STATE.MENU) startGameCallback();
      if (S.gameState === C.STATE.GAMEOVER) restartGameCallback();
    }
    if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].indexOf(e.key) !== -1) e.preventDefault();
  });

  window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
    updateInputDirectionFromKeys();
  });
}

function updateTouchDirection() {
  if (!touchActive) return;
  if (touchX < S.WIDTH / 3) S.inputDirection = -1;
  else if (touchX > S.WIDTH * 2 / 3) S.inputDirection = 1;
  else S.inputDirection = 0;
}

function updateInputDirectionFromKeys() {
  var left = keys['ArrowLeft'] || keys['a'] || keys['A'];
  var right = keys['ArrowRight'] || keys['d'] || keys['D'];
  if (left && !right) S.inputDirection = -1;
  else if (right && !left) S.inputDirection = 1;
  else if (!touchActive) S.inputDirection = 0;
}

J.input = {
  initInput: initInput
};
