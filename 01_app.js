const historyEl = document.getElementById('history');
const outputEl = document.getElementById('output');
const keys = document.querySelector('.keys');

let expr = '';
let memory = 0;

function updateDisplay() {

    historyEl.textContent = expr || '\u00A0';

    outputEl.textContent = expr === '' ? '0' : expr;
}

function convertExpression(s) {

    return s
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/√/g, 'Math.sqrt');
}

function isSafeExpression(jsExpr) {

    return /^[0-9+\-*/().%\s*Mathsqrt]+$/.test(jsExpr);
}

function evaluateExpression(s) {

    let jsExpr = convertExpression(s);

    if (!isSafeExpression(jsExpr)) {
        throw new Error();
    }

    return Function(
        '"use strict"; return (' + jsExpr + ')'
    )();
}

keys.addEventListener('click', (e) => {

    const btn = e.target.closest('button');

    if (!btn) return;

    const val = btn.dataset.value;
    const action = btn.dataset.action;

    switch (action) {

        case 'clear':

            expr = '';

            updateDisplay();

            return;

        case 'del':

            expr = expr.slice(0, -1);

            updateDisplay();

            return;

        case 'mc':

            memory = 0;

            return;

        case 'mr':

            expr += memory;

            updateDisplay();

            return;

        case 'mplus':

            try {

                memory += Number(evaluateExpression(expr || '0'));

            } catch {}

            return;

        case 'mminus':

            try {

                memory -= Number(evaluateExpression(expr || '0'));

            } catch {}

            return;

        case 'equals':

            try {

                let result = evaluateExpression(expr || '0');

                expr = String(result);

                updateDisplay();

            }

            catch {

                outputEl.textContent = 'Error';

                setTimeout(updateDisplay, 1000);

            }

            return;
    }

    if (val) {

        if (val === '√') {

            expr += '√(';

        }

        else {

            expr += val;

        }

        updateDisplay();
    }

});

window.addEventListener('keydown', (e) => {

    const key = e.key;

    if (/^[0-9]$/.test(key)) {

        expr += key;
    }

    else if (['+', '-', '*', '/'].includes(key)) {

        expr += key === '*' ? '×' :

                key === '/' ? '÷' :

                key;
    }

    else if (key === '^') {

        expr += '^';
    }

    else if (key === '%') {

        expr += '%';
    }

    else if (key === '(' || key === ')') {

        expr += key;
    }

    else if (key === '.') {

        expr += '.';
    }

    else if (key === 'Backspace') {

        expr = expr.slice(0, -1);
    }

    else if (key === 'Escape') {

        expr = '';
    }

    else if (key === 'Enter') {

        e.preventDefault();

        try {

            expr = String(
                evaluateExpression(expr || '0')
            );
        }

        catch {

            outputEl.textContent = 'Error';

            setTimeout(updateDisplay, 1000);
        }
    }

    else {

        return;
    }

    updateDisplay();

});

updateDisplay();