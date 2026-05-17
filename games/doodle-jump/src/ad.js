// ad.js - 广告模块 (web 版: no-op, 直接跳过所有广告)
var J = window.J || {};
var C = J.config;

function init() {}

function showRewarded(onReward, onFail) {
  // Web 版直接给奖励 (无广告)
  if (onReward) onReward();
}

function showInterstitial(onDone) {
  // Web 版直接跳过插屏
  if (onDone) onDone();
}

function showBanner() {}

function hideBanner() {}

function resetFrequency() {}

J.ad = {
  init: init,
  showRewarded: showRewarded,
  showInterstitial: showInterstitial,
  showBanner: showBanner,
  hideBanner: hideBanner,
  resetFrequency: resetFrequency
};
