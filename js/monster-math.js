// 游戏状态
const gameState = {
    score: 0,
    level: 1,
    playerValue: 0,
    enemyValue: 0,
    isGameActive: false
};

// 难度设置
const DIFFICULTY_SETTINGS = {
    easy: { min: 1, max: 10 },
    medium: { min: 1, max: 20 },
    hard: { min: 1, max: 30 }
};

// DOM 元素
const elements = {
    settingsBtn: document.getElementById('settingsBtn'),
    settingsPanel: document.getElementById('settingsPanel'),
    startGameBtn: document.getElementById('startGame'),
    playAgainBtn: document.getElementById('playAgain'),
    scoreDisplay: document.getElementById('score'),
    levelDisplay: document.getElementById('level'),
    playerMonster: document.querySelector('.player-monster'),
    enemyMonster: document.querySelector('.enemy-monster'),
    operationButtons: document.querySelector('.operation-buttons'),
    resultMessage: document.querySelector('.result-message'),
    gameResult: document.querySelector('.game-result'),
    finalScore: document.getElementById('finalScore'),
    finalLevel: document.getElementById('finalLevel')
};

// 运算符设置
const operations = {
    addition: {
        symbol: '+',
        execute: (a, b) => a + b,
        isEnabled: () => document.getElementById('allowAddition').checked
    },
    subtraction: {
        symbol: '-',
        execute: (a, b) => a - b,
        isEnabled: () => document.getElementById('allowSubtraction').checked
    },
    multiplication: {
        symbol: '×',
        execute: (a, b) => a * b,
        isEnabled: () => document.getElementById('allowMultiplication').checked
    }
};

// 初始化游戏
function initGame() {
    elements.settingsBtn.addEventListener('click', toggleSettings);
    elements.startGameBtn.addEventListener('click', startGame);
    elements.playAgainBtn.addEventListener('click', restartGame);
    showSettings();
}

// 切换设置面板
function toggleSettings() {
    if (gameState.isGameActive) {
        if (!confirm('当前游戏进行中，确定要重新开始吗？')) {
            return;
        }
    }
    elements.settingsPanel.style.display = 
        elements.settingsPanel.style.display === 'none' ? 'block' : 'none';
}

// 显示设置面板
function showSettings() {
    elements.settingsPanel.style.display = 'block';
    elements.gameResult.style.display = 'none';
}

// 开始新游戏
function startGame() {
    if (!validateSettings()) {
        alert('请至少选择一种运算类型！');
        return;
    }

    gameState.isGameActive = true;
    gameState.score = 0;
    gameState.level = 1;
    elements.settingsPanel.style.display = 'none';
    elements.gameResult.style.display = 'none';
    updateStats();
    generateRound();
}

// 验证设置
function validateSettings() {
    return Object.values(operations).some(op => op.isEnabled());
}

// 重启游戏
function restartGame() {
    showSettings();
}

// 生成新回合
function generateRound() {
    const difficulty = getDifficulty();
    gameState.playerValue = generateRandomNumber(difficulty);
    gameState.enemyValue = generateRandomNumber(difficulty);
    
    updateMonsterValues();
    generateOperationButtons();
}

// 获取当前难度设置
function getDifficulty() {
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    return DIFFICULTY_SETTINGS[selectedDifficulty];
}

// 生成随机数
function generateRandomNumber({ min, max }) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 更新怪物数值显示
function updateMonsterValues() {
    elements.playerMonster.querySelector('.monster-value').textContent = gameState.playerValue;
    elements.enemyMonster.querySelector('.monster-value').textContent = gameState.enemyValue;
}

// 生成操作按钮
function generateOperationButtons() {
    elements.operationButtons.innerHTML = '';
    
    if (operations.addition.isEnabled()) {
        addOperationButton('+', () => handleOperation('addition'));
    }
    if (operations.subtraction.isEnabled()) {
        addOperationButton('-', () => handleOperation('subtraction'));
    }
    if (operations.multiplication.isEnabled()) {
        addOperationButton('×2', () => handleMultiplication(2));
        addOperationButton('×3', () => handleMultiplication(3));
    }
}

// 添加操作按钮
function addOperationButton(symbol, handler) {
    const button = document.createElement('button');
    button.className = 'operation-button';
    button.textContent = symbol;
    button.addEventListener('click', handler);
    elements.operationButtons.appendChild(button);
}

// 处理运算操作
function handleOperation(operationType) {
    const operation = operations[operationType];
    const result = operation.execute(gameState.playerValue, gameState.enemyValue);
    const calculation = `${gameState.playerValue} ${operation.symbol} ${gameState.enemyValue} = ${result}`;
    checkResult(result > gameState.enemyValue, calculation);
}

// 处理乘法操作
function handleMultiplication(multiplier) {
    const result = gameState.playerValue * multiplier;
    const calculation = `${gameState.playerValue} × ${multiplier} = ${result}`;
    checkResult(result > gameState.enemyValue, calculation);
}

// 检查结果
function checkResult(isWinner, calculation) {
    elements.playerMonster.classList.add(isWinner ? 'winner' : 'loser');
    elements.enemyMonster.classList.add(isWinner ? 'loser' : 'winner');
    
    showResultMessage(isWinner, calculation);
    
    if (isWinner) {
        const bonus = calculateBonus();
        gameState.score += bonus;
        gameState.level++;
    } else {
        endGame();
        return;
    }
    
    updateStats();
    setTimeout(() => {
        resetRound();
        generateRound();
    }, 2500);
}

// 计算奖励分数
function calculateBonus() {
    const baseScore = gameState.level * 10;
    const difficulty = getDifficulty();
    const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2
    }[difficulty.value] || 1;
    
    return Math.round(baseScore * difficultyMultiplier);
}

// 显示结果消息
function showResultMessage(isWinner, calculation) {
    elements.resultMessage.className = `result-message ${isWinner ? 'success' : 'failure'}`;
    
    const bonus = isWinner ? calculateBonus() : 0;
    const message = isWinner 
        ? `<div class="calculation">${calculation}</div>
           <div class="result-text">太棒了！你赢了！</div>
           <div class="bonus">+${bonus} 分</div>`
        : `<div class="calculation">${calculation}</div>
           <div class="result-text">继续加油！</div>`;
    
    elements.resultMessage.innerHTML = message;
    elements.resultMessage.style.display = 'block';
}

// 重置回合
function resetRound() {
    elements.playerMonster.classList.remove('winner', 'loser');
    elements.enemyMonster.classList.remove('winner', 'loser');
    elements.resultMessage.style.display = 'none';
}

// 更新游戏统计
function updateStats() {
    elements.scoreDisplay.textContent = gameState.score;
    elements.levelDisplay.textContent = gameState.level;
}

// 结束游戏
function endGame() {
    gameState.isGameActive = false;
    elements.finalScore.textContent = gameState.score;
    elements.finalLevel.textContent = gameState.level;
    
    setTimeout(() => {
        elements.gameResult.style.display = 'block';
    }, 1500);
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame); 
