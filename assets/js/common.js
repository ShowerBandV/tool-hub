// 防 clickjacking: 检测 iframe 嵌入则清空页面
(function() {
  if (window.top !== window.self) {
    document.documentElement.innerHTML = '';
    return;
  }
})();

// Common utilities for Tool Hub

function preciseRound(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

function escapeHTML(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function showToast(msg, duration = 1800) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
}

function shakeElement(el) {
  if (!el) return;
  el.style.transition = 'none';
  el.style.transform = 'translateX(0)';
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-7px)' },
    { transform: 'translateX(7px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(4px)' },
    { transform: 'translateX(-2px)' },
    { transform: 'translateX(2px)' },
    { transform: 'translateX(0)' }
  ];
  const anim = el.animate(keyframes, { duration: 450, easing: 'ease-in-out' });
  anim.onfinish = () => { el.style.transform = ''; el.style.transition = ''; };
  el.style.borderColor = '#ef4444';
  setTimeout(() => { el.style.borderColor = ''; }, 550);
}

function downloadText(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click(); URL.revokeObjectURL(url);
}

function downloadImage(canvas, filename = 'image.png') {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click(); URL.revokeObjectURL(url);
  });
}

// Letter grade mappings (used by multiple calculator tools)
const LETTER_TO_GPA = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

const LETTER_TO_PERCENT = {
  'A+': [97,100], 'A': [93,96], 'A-': [90,92],
  'B+': [87,89], 'B': [83,86], 'B-': [80,82],
  'C+': [77,79], 'C': [73,76], 'C-': [70,72],
  'D+': [67,69], 'D': [63,66], 'D-': [60,62],
  'F': [0,59]
};

function percentToLetter(p) {
  const v = preciseRound(p, 1);
  if (v >= 97) return 'A+'; if (v >= 93) return 'A'; if (v >= 90) return 'A-';
  if (v >= 87) return 'B+'; if (v >= 83) return 'B'; if (v >= 80) return 'B-';
  if (v >= 77) return 'C+'; if (v >= 73) return 'C'; if (v >= 70) return 'C-';
  if (v >= 67) return 'D+'; if (v >= 63) return 'D'; if (v >= 60) return 'D-';
  return 'F';
}

function percentToGPA(p) { return LETTER_TO_GPA[percentToLetter(p)] || 0; }
