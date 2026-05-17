// render.js - 所有绘制函数
var J = window.J || {};
var C = J.config;
var S = J.state;

function drawStar(context, cx, cy, outerR, innerR, points) {
  context.beginPath();
  for (var i = 0; i < points * 2; i++) {
    var r = i % 2 === 0 ? outerR : innerR;
    var angle = (i * Math.PI) / points - Math.PI / 2;
    var x = cx + Math.cos(angle) * r, y = cy + Math.sin(angle) * r;
    if (i === 0) context.moveTo(x, y); else context.lineTo(x, y);
  }
  context.closePath();
}

function drawBackground() {
  var ctx = S.ctx;
  ctx.fillStyle = '#fdfaf2'; ctx.fillRect(0, 0, S.WIDTH, S.HEIGHT);
  ctx.strokeStyle = '#d5d0c5'; ctx.lineWidth = 0.5;
  for (var i = 0; i < S.WIDTH; i += 80) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S.HEIGHT); ctx.stroke(); }
  for (var j = 0; j < S.HEIGHT; j += 80) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(S.WIDTH, j); ctx.stroke(); }
}

function drawClouds(parallax, alpha) {
  var ctx = S.ctx;
  ctx.save(); ctx.globalAlpha = alpha * 0.3;
  var baseY = -S.cameraY * parallax;
  for (var i = 0; i < 4; i++) {
    var cx = (i * 230 + 100) % S.WIDTH, cy = (i * 280 + 150) % S.HEIGHT + baseY;
    var adjY = ((cy % S.HEIGHT) + S.HEIGHT) % S.HEIGHT;
    ctx.fillStyle = '#ccc'; ctx.beginPath();
    ctx.arc(cx, adjY, 18, 0, Math.PI * 2); ctx.arc(cx - 15, adjY + 5, 14, 0, Math.PI * 2); ctx.arc(cx + 15, adjY + 3, 16, 0, Math.PI * 2);
    ctx.fill(); ctx.strokeStyle = '#999'; ctx.lineWidth = 1; ctx.stroke();
  }
  ctx.restore();
}

function drawPlatforms() {
  var ctx = S.ctx;
  for (var i = 0; i < S.platforms.length; i++) {
    var p = S.platforms[i];
    if (p.broken && p.flashTimer <= 0 && p.particles.length === 0) continue;
    var sy = p.y - S.cameraY; if (sy < -40 || sy > S.HEIGHT + 40) continue;
    ctx.save();
    var alpha = p.flashTimer > 0 ? Math.min(1, p.flashTimer / 0.15) * 0.7 : 1;
    ctx.globalAlpha = alpha;
    var px = p.x, py = sy, pw = p.width, ph = p.height;

    ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.roundRect(px - pw / 2 + 3, py - ph / 2 + 3, pw, ph, 6); ctx.fill();
    ctx.fillStyle = p.typeDef.fill; ctx.strokeStyle = p.typeDef.stroke; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 6); ctx.fill(); ctx.stroke();

    // 弹簧装饰
    if (p.typeDef.hasSpring && p.springTimer <= 0) {
      ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5; ctx.beginPath();
      ctx.moveTo(px - 12, py - ph / 2 - 8); ctx.lineTo(px + 12, py - ph / 2 - 8);
      ctx.lineTo(px - 12, py - ph / 2); ctx.lineTo(px + 12, py - ph / 2);
      ctx.lineTo(px - 12, py - ph / 2 + 7); ctx.lineTo(px + 12, py - ph / 2 + 7);
      ctx.stroke();
    }

    // 喷气背包装饰
    if (p.typeDef.hasJetpack && !p.jetpackCollected) {
      var starY = py - ph / 2 - 12;
      ctx.fillStyle = '#444'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
      drawStar(ctx, px, starY, 7, 11, 4); ctx.fill(); ctx.stroke();
    }

    // 易碎平台裂纹
    if (p.typeDef.fragile && !p.broken) {
      ctx.strokeStyle = '#888'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(px - pw / 4, py - ph / 2 + 2); ctx.lineTo(px + pw / 5, py + ph / 2 - 3);
      ctx.moveTo(px + pw / 6, py - ph / 2 + 1); ctx.lineTo(px - pw / 3, py + ph / 2 - 2); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }
}

function drawPlayer() {
  var p = S.player;
  var ctx = S.ctx;
  var sy = p.y - S.cameraY;
  if (sy < -80 || sy > S.HEIGHT + 100) return;
  ctx.save(); ctx.translate(p.x, sy);
  var scX = 1, scY = 1;
  if (p.squashTimer > 0) {
    var t = Math.min(1, p.squashTimer / 0.15);
    scX = 1 + t * 0.25; scY = 1 - t * 0.2;
  }
  if (p.jetpackActive && p.jetpackFuel > 0) { scY = 1.1; scX = 0.9; }
  ctx.scale(scX, scY);
  for (var i = 0; i < p.trailPositions.length; i++) {
    var tr = p.trailPositions[i];
    var ty = tr.y - p.y;
    ctx.fillStyle = 'rgba(80,80,80,' + (tr.life * 0.4) + ')';
    ctx.beginPath(); ctx.arc(tr.x - p.x, ty, 2 + tr.life * 3, 0, Math.PI * 2); ctx.fill();
  }
  if (p.jetpackActive && p.jetpackFuel > 0) {
    ctx.fillStyle = '#444'; ctx.beginPath();
    ctx.moveTo(-12, p.height / 2 - 2);
    ctx.quadraticCurveTo(-6, p.height / 2 + 18, 0, p.height / 2 + 24);
    ctx.quadraticCurveTo(6, p.height / 2 + 18, 12, p.height / 2 - 2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath();
  ctx.ellipse(0, p.height / 2 - 2, p.width / 2 - 2, 6, 0, 0, Math.PI * 2); ctx.fill();
  S.selectedCharacter.draw(ctx, p, S.inputDirection);
  ctx.restore();
}

function drawCollectibles() {
  var ctx = S.ctx;
  for (var i = 0; i < S.collectibles.length; i++) {
    var c = S.collectibles[i];
    var sy = c.y - S.cameraY; if (sy < -40 || sy > S.HEIGHT + 40) continue;
    ctx.save(); ctx.translate(c.x, sy);
    var sc = c.animScale || 1; ctx.scale(sc, sc);
    ctx.fillStyle = '#222'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, c.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '16px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c.icon, 0, 1);
    ctx.restore();
  }
}

function drawParticles() {
  var ctx = S.ctx;
  for (var i = 0; i < S.particles.length; i++) {
    var p = S.particles[i];
    var sy = p.y - S.cameraY; if (sy < -20 || sy > S.HEIGHT + 20) continue;
    ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
    if (p.isFragment) {
      ctx.save(); ctx.translate(p.x, sy); ctx.rotate(p.rotation || 0);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(p.x, sy, p.size, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawHUD() {
  var ctx = S.ctx;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.roundRect(6, 6, S.WIDTH - 12, 40, 12); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(6, 6, S.WIDTH - 12, 40, 12); ctx.stroke();

  ctx.fillStyle = '#222'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('🏆 ' + S.score, 16, 31);
  var coinText = '🪙 ' + S.coins;
  var coinW = ctx.measureText(coinText).width;
  ctx.fillText(coinText, S.WIDTH / 2 - coinW / 2 - 30, 31);
  ctx.fillText('💎 ' + S.skinShards, S.WIDTH / 2 + 5, 31);
  ctx.textAlign = 'right';
  ctx.fillText('👑 ' + S.bestScore, S.WIDTH - 16, 31);
  ctx.textAlign = 'left';

  if (S.activeSpeedBoost && S.speedBoostTimer > 0) {
    var buffText = '⚡ ' + Math.ceil(S.speedBoostTimer) + 's';
    var buffW = ctx.measureText(buffText).width;
    ctx.fillStyle = 'rgba(255,255,200,0.9)';
    ctx.beginPath(); ctx.roundRect(S.WIDTH / 2 - buffW / 2 - 10, 50, buffW + 20, 22, 10); ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(S.WIDTH / 2 - buffW / 2 - 10, 50, buffW + 20, 22, 10); ctx.stroke();
    ctx.fillStyle = '#111'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(buffText, S.WIDTH / 2, 66);
    ctx.textAlign = 'left';
  }
}

function drawUI() {
  var ctx = S.ctx;

  if (S.gameState === C.STATE.INTERSTITIAL) {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, S.WIDTH, S.HEIGHT);
    ctx.textAlign = 'left';
    return;
  }

  if (S.gameState === C.STATE.MENU) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, S.WIDTH, S.HEIGHT);
    ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 32px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🚀 一跳冲天', S.WIDTH / 2, S.HEIGHT * 0.2);
    ctx.font = '16px sans-serif';
    ctx.fillText('选择角色 (点击图标)', S.WIDTH / 2, S.HEIGHT * 0.55);

    var iconSize = 50, startX = S.WIDTH / 2 - (C.CHARACTERS.length * (iconSize + 15)) / 2 + 15, yPos = S.HEIGHT * 0.68;
    for (var i = 0; i < C.CHARACTERS.length; i++) {
      var cx = startX + i * (iconSize + 15);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(cx - iconSize / 2, yPos - iconSize / 2, iconSize, iconSize, 8); ctx.fill(); ctx.stroke();
      if (S.selectedCharacter === C.CHARACTERS[i]) {
        ctx.strokeStyle = '#ff0'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(cx - iconSize / 2 - 2, yPos - iconSize / 2 - 2, iconSize + 4, iconSize + 4, 10); ctx.stroke();
      }
      ctx.save(); ctx.translate(cx, yPos);
      C.CHARACTERS[i].draw(ctx, { width: 30, height: 34, facingRight: true }, 0);
      ctx.restore();
      ctx.fillStyle = '#111'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(C.CHARACTERS[i].name, cx, yPos + iconSize / 2 + 12);
    }
    ctx.fillStyle = '#f0f0f0'; ctx.font = '14px sans-serif';
    ctx.fillText('点击空白处开始', S.WIDTH / 2, S.HEIGHT * 0.88);
    ctx.textAlign = 'left';
  }

  if (S.gameState === C.STATE.REVIVE) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, S.WIDTH, S.HEIGHT);

    ctx.fillStyle = '#ff6b6b'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('💀 你摔下去了!', S.WIDTH / 2, S.HEIGHT * 0.15);
    ctx.fillStyle = '#fff'; ctx.font = '18px sans-serif';
    ctx.fillText('得分: ' + S.score + '   🪙' + S.coins + '   💎' + S.skinShards, S.WIDTH / 2, S.HEIGHT * 0.23);
    if (S.maxCombo > 3) {
      ctx.fillStyle = '#ffd700'; ctx.font = 'bold 14px sans-serif';
      ctx.fillText('最高连击: ' + S.maxCombo + 'x', S.WIDTH / 2, S.HEIGHT * 0.29);
    }

    var btnW = 200, btnH = 54, btnX = S.WIDTH / 2, btnY1 = S.HEIGHT * 0.40, btnY2 = S.HEIGHT * 0.53;

    var glow = 1 + Math.sin(Date.now() / 250) * 0.08;
    ctx.fillStyle = 'rgba(255,215,0,0.25)';
    ctx.beginPath(); ctx.roundRect(btnX - btnW / 2 * glow - 5, btnY1 - btnH / 2 * glow - 5,
      btnW * glow + 10, btnH * glow + 10, 16); ctx.fill();

    var revGrad = ctx.createLinearGradient(btnX, btnY1 - btnH / 2, btnX, btnY1 + btnH / 2);
    revGrad.addColorStop(0, '#f7c948'); revGrad.addColorStop(1, '#e67e22');
    ctx.fillStyle = revGrad;
    ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(btnX - btnW / 2, btnY1 - btnH / 2, btnW, btnH, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px sans-serif';
    ctx.fillText('🔥 看广告复活 (' + (3 - S.reviveCount) + '/3)', btnX, btnY1 + 4);

    ctx.fillStyle = '#555'; ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(btnX - btnW / 2, btnY2 - btnH / 2, btnW, btnH, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#aaa'; ctx.font = 'bold 16px sans-serif';
    ctx.fillText('放弃', btnX, btnY2 + 4);

    ctx.fillStyle = '#ccc'; ctx.font = '12px sans-serif';
    ctx.fillText('复活保留分数, 难度从零开始', S.WIDTH / 2, btnY2 + 42);
    ctx.textAlign = 'left';
  }

  if (S.gameState === C.STATE.GAMEOVER) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, S.WIDTH, S.HEIGHT);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('游戏结束', S.WIDTH / 2, S.HEIGHT * 0.30);
    ctx.font = '18px sans-serif';
    ctx.fillText('得分: ' + S.score + '   🪙' + S.coins + '   💎' + S.skinShards, S.WIDTH / 2, S.HEIGHT * 0.40);
    if (S.maxCombo > 3) {
      ctx.fillStyle = '#ffd700'; ctx.font = 'bold 15px sans-serif';
      ctx.fillText('最高连击: ' + S.maxCombo + 'x', S.WIDTH / 2, S.HEIGHT * 0.47);
      ctx.fillStyle = '#fff'; ctx.font = '18px sans-serif';
    }
    ctx.fillText('最高分: ' + S.bestScore, S.WIDTH / 2, S.HEIGHT * 0.54);
    ctx.font = '16px sans-serif';
    ctx.fillText('点击重新开始', S.WIDTH / 2, S.HEIGHT * 0.64);
    ctx.textAlign = 'left';
  }
}

function drawFloatingTexts() {
  var ctx = S.ctx;
  for (var i = 0; i < S.floatingTexts.length; i++) {
    var ft = S.floatingTexts[i];
    var sy = ft.y - S.cameraY;
    if (sy < -60 || sy > S.HEIGHT + 20) continue;
    ctx.save();
    ctx.globalAlpha = ft.life;
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, sy);
    ctx.restore();
  }
}

function drawCombo() {
  if (S.combo < 3 || S.gameState !== C.STATE.PLAYING) return;
  var ctx = S.ctx;
  var pulse = 1 + Math.sin(Date.now() / 150) * 0.15;
  ctx.save();
  ctx.globalAlpha = Math.min(1, S.comboTimer / 0.3);
  ctx.translate(S.WIDTH / 2, S.HEIGHT * 0.25);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = '#ff6b6b';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeText('COMBO x' + S.combo, 0, 0);
  ctx.fillText('COMBO x' + S.combo, 0, 0);
  ctx.restore();
}

function drawAdButton() {
  var ctx = S.ctx;
  var btnW = 56, btnH = 56;
  var btnCX = S.WIDTH - 40, btnCY = S.HEIGHT - 40;
  var ready = S.adCooldown <= 0;

  ctx.save();

  if (ready) {
    var pulse = 1 + Math.sin(Date.now() / 300) * 0.12;
    ctx.globalAlpha = 0.35 + Math.sin(Date.now() / 300) * 0.2;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.roundRect(btnCX - btnW / 2 * pulse - 4, btnCY - btnH / 2 * pulse - 4,
      btnW * pulse + 8, btnH * pulse + 8, 14);
    ctx.fill();
  }

  ctx.globalAlpha = ready ? 1 : 0.5;
  var grad = ctx.createLinearGradient(btnCX, btnCY - btnH / 2, btnCX, btnCY + btnH / 2);
  if (ready) {
    grad.addColorStop(0, '#ff6b35');
    grad.addColorStop(1, '#f7c948');
  } else {
    grad.addColorStop(0, '#666');
    grad.addColorStop(1, '#999');
  }
  ctx.fillStyle = grad;
  ctx.strokeStyle = ready ? '#c0392b' : '#555';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(btnCX - btnW / 2, btnCY - btnH / 2, btnW, btnH, 12); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🚀', btnCX, btnCY - 7);

  ctx.font = 'bold 9px sans-serif';
  ctx.fillText(ready ? '免费' : '冷却', btnCX, btnCY + 13);

  if (!ready) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.roundRect(btnCX - btnW / 2, btnCY - btnH / 2, btnW, btnH, 12); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif';
    ctx.fillText(Math.ceil(S.adCooldown) + 's', btnCX, btnCY);
  }
  ctx.restore();
}

function render() {
  var ctx = S.ctx;
  ctx.setTransform(S.scaleX, 0, 0, S.scaleY, 0, 0);
  ctx.clearRect(0, 0, S.WIDTH, S.HEIGHT);

  var sx = 0, sy = 0;
  if (S.shakeAmount > 0.1) {
    sx = (Math.random() - 0.5) * S.shakeAmount * 2;
    sy = (Math.random() - 0.5) * S.shakeAmount * 2;
  }

  ctx.save();
  if (sx !== 0 || sy !== 0) ctx.translate(sx, sy);

  drawBackground();
  if (S.gameState === C.STATE.PLAYING || S.gameState === C.STATE.REVIVE || S.gameState === C.STATE.INTERSTITIAL) {
    drawClouds(0.15, 0.5); drawClouds(0.35, 0.3);
    drawPlatforms();
    drawCollectibles();
    drawParticles();
    drawPlayer();
    drawHUD();
    if (S.gameState === C.STATE.PLAYING) drawAdButton();
  }
  ctx.restore();
  drawUI();

  drawFloatingTexts();
  drawCombo();
}

J.render = {
  render: render,
  drawFloatingTexts: drawFloatingTexts,
  drawCombo: drawCombo
};
