const historyEl = document.getElementById('history');
const outputEl = document.getElementById('output');
const keys = document.querySelector('.keys');

let expr = '';
let lastResult = null;

function updateDisplay() {
  historyEl.textContent = expr || '\u00A0';
  outputEl.textContent = expr === '' ? '0' : expr;
}

function toJsExpression(s) {
  return s.replace(/×/g, '*').replace(/÷/g, '/');
}

function isSafeExpression(jsExpr) {
  return /^[0-9+\-*/().\s%]+$/.test(jsExpr);
}

function evaluateExpression(s) {
  const jsExpr = toJsExpression(s);
  if (!isSafeExpression(jsExpr)) throw new Error('Invalid characters');
  if (jsExpr.length > 200) throw new Error('Expression too long');
  return Function('"use strict"; return (' + jsExpr + ')')();
}

keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const val = btn.dataset.value;
  const action = btn.dataset.action;

  if (action === 'clear') {
    expr = '';
    lastResult = null;
    updateDisplay();
    return;
  }

  if (action === 'del') {
    expr = expr.slice(0, -1);
    updateDisplay();
    return;
  }

  if (action === 'equals') {
    try {
      const result = evaluateExpression(expr || '0');
      lastResult = result;
      expr = String(result);
      updateDisplay();
    } catch (err) {
      outputEl.textContent = 'Error';
      setTimeout(updateDisplay, 800);
    }
    return;
  }

  if (val) {
    if (val === '.') {
      const tokens = expr.split(/[\+\-\×\÷\*\/\s]/).filter(Boolean);
      const last = tokens[tokens.length - 1] || '';
      if (last.includes('.')) return;
    }
    expr += val;
    updateDisplay();
  }
});

window.addEventListener('keydown', (e) => {
  const key = e.key;
  if ((/^[0-9]$/).test(key)) {
    expr += key;
  } else if (['+', '-', '*', '/'].includes(key)) {
    expr += key === '*' ? '×' : key === '/' ? '÷' : key;
  } else if (key === 'Enter') {
    e.preventDefault();
    try {
      const result = evaluateExpression(expr || '0');
      lastResult = result;
      expr = String(result);
    } catch (err) {
      outputEl.textContent = 'Error';
      setTimeout(updateDisplay, 800);
    }
  } else if (key === 'Backspace') {
    expr = expr.slice(0, -1);
  } else if (key === '.') {
    expr += '.';
  } else if (key === 'Escape') {
    expr = '';
  } else {
    return;
  }
  updateDisplay();
});

updateDisplay();
