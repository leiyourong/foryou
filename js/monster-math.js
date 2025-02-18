document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const startPracticeBtn = document.getElementById('startPractice');
    const practiceAgainBtn = document.getElementById('practiceAgain');
    const practiceBoard = document.querySelector('.practice-board');
    const practiceResult = document.querySelector('.practice-result');
    const questionDisplay = document.querySelector('.question-display');
    const answerInput = document.getElementById('answer');
    const resultMessage = document.querySelector('.result-message');
    const numPad = document.querySelector('.number-pad');

    // 游戏状态
    let gameState = {
        score: 0,
        level: 1,
        streak: 0,
        maxStreak: 0,
        currentProblem: null,
        isActive: false
    };

    // 初始化
    function init() {
        loadSettings();
        setupEventListeners();
        showSettings();
    }

    // 加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('monsterMathSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('allowAddition').checked = settings.allowAddition;
            document.getElementById('allowSubtraction').checked = settings.allowSubtraction;
            document.getElementById('allowMultiplication').checked = settings.allowMultiplication;
            document.querySelector(`input[name="difficulty"][value="${settings.difficulty}"]`).checked = true;
        }
    }

    // 保存设置
    function saveSettings() {
        const settings = {
            allowAddition: document.getElementById('allowAddition').checked,
            allowSubtraction: document.getElementById('allowSubtraction').checked,
            allowMultiplication: document.getElementById('allowMultiplication').checked,
            difficulty: document.querySelector('input[name="difficulty"]:checked').value
        };
        localStorage.setItem('monsterMathSettings', JSON.stringify(settings));
    }

    // 设置事件监听器
    function setupEventListeners() {
        settingsBtn.addEventListener('click', toggleSettings);
        startPracticeBtn.addEventListener('click', startPractice);
        practiceAgainBtn.addEventListener('click', restartPractice);

        // 数字键盘事件
        numPad.addEventListener('click', handleNumPadClick);

        // 键盘事件
        document.addEventListener('keydown', handleKeyPress);
    }

    // 处理数字键盘点击
    function handleNumPadClick(e) {
        if (!gameState.isActive) return;

        const target = e.target;
        if (target.classList.contains('num-btn')) {
            appendNumber(target.textContent);
        } else if (target.classList.contains('clear-btn')) {
            clearAnswer();
        } else if (target.classList.contains('submit-btn')) {
            submitAnswer();
        }
    }

    // 处理键盘按键
    function handleKeyPress(e) {
        if (!gameState.isActive) return;

        if (e.key >= '0' && e.key <= '9') {
            appendNumber(e.key);
        } else if (e.key === 'Backspace') {
            clearAnswer();
        } else if (e.key === 'Enter') {
            submitAnswer();
        }
    }

    // 添加数字到答案
    function appendNumber(num) {
        if (answerInput.value.length < 3) {
            answerInput.value += num;
        }
    }

    // 清除答案
    function clearAnswer() {
        answerInput.value = '';
    }

    // 切换设置面板
    function toggleSettings() {
        if (gameState.isActive) {
            if (!confirm('当前练习进行中，确定要重新开始吗？')) {
                return;
            }
        }
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
        practiceBoard.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    }

    // 显示设置面板
    function showSettings() {
        settingsPanel.style.display = 'block';
        practiceBoard.style.display = 'none';
        practiceResult.style.display = 'none';
    }

    // 开始练习
    function startPractice() {
        if (!validateSettings()) {
            alert('请至少选择一种运算！');
            return;
        }

        saveSettings();
        resetGameState();
        settingsPanel.style.display = 'none';
        practiceBoard.style.display = 'block';
        practiceResult.style.display = 'none';
        generateProblem();
    }

    // 重新开始练习
    function restartPractice() {
        showSettings();
    }

    // 验证设置
    function validateSettings() {
        return document.getElementById('allowAddition').checked ||
               document.getElementById('allowSubtraction').checked ||
               document.getElementById('allowMultiplication').checked;
    }

    // 重置游戏状态
    function resetGameState() {
        gameState = {
            score: 0,
            level: 1,
            streak: 0,
            maxStreak: 0,
            currentProblem: null,
            isActive: true
        };
        updateStats();
        clearAnswer();
        answerInput.disabled = false;
        resultMessage.style.display = 'none';
    }

    // 生成题目
    function generateProblem() {
        const difficulty = getDifficultyRange();
        const operations = getEnabledOperations();
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        if (operation === '×') {
            num1 = Math.floor(Math.random() * (difficulty.max / 3)) + 1;
            num2 = Math.floor(Math.random() * 2) + 2; // 只使用2或3作为乘数
            answer = num1 * num2;
        } else if (operation === '+') {
            num1 = Math.floor(Math.random() * (difficulty.max - 1)) + 1;
            num2 = Math.floor(Math.random() * (difficulty.max - num1)) + 1;
            answer = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * (difficulty.max - 1)) + 2;
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            answer = num1 - num2;
        }

        gameState.currentProblem = { num1, num2, operation, answer };
        displayProblem();
    }

    // 获取当前难度范围
    function getDifficultyRange() {
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        return {
            easy: { min: 1, max: 10 },
            medium: { min: 1, max: 20 },
            hard: { min: 1, max: 30 }
        }[difficulty];
    }

    // 获取启用的运算
    function getEnabledOperations() {
        const operations = [];
        if (document.getElementById('allowAddition').checked) operations.push('+');
        if (document.getElementById('allowSubtraction').checked) operations.push('-');
        if (document.getElementById('allowMultiplication').checked) operations.push('×');
        return operations;
    }

    // 显示题目
    function displayProblem() {
        const { num1, num2, operation } = gameState.currentProblem;
        document.getElementById('num1').textContent = num1;
        document.getElementById('operator').textContent = operation;
        document.getElementById('num2').textContent = num2;
        clearAnswer();
    }

    // 提交答案
    function submitAnswer() {
        if (!gameState.isActive || !answerInput.value) return;

        const userAnswer = parseInt(answerInput.value);
        const isCorrect = userAnswer === gameState.currentProblem.answer;

        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }

        showResultMessage(isCorrect);
        setTimeout(() => {
            if (gameState.isActive) {
                generateProblem();
            }
        }, 1500);
    }

    // 处理正确答案
    function handleCorrectAnswer() {
        gameState.streak++;
        gameState.maxStreak = Math.max(gameState.maxStreak, gameState.streak);
        
        // 根据难度和连续答对次数计算得分
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        const baseScore = {
            easy: 10,
            medium: 15,
            hard: 20
        }[difficulty];
        
        const streakBonus = Math.floor(gameState.streak / 5) * 5;
        gameState.score += baseScore + streakBonus;

        // 每5题连续答对提升等级
        if (gameState.streak % 5 === 0) {
            gameState.level++;
        }

        updateStats();
    }

    // 处理错误答案
    function handleIncorrectAnswer() {
        gameState.streak = 0;
        updateStats();
        endPractice();
    }

    // 显示结果消息
    function showResultMessage(isCorrect) {
        const { num1, num2, operation, answer } = gameState.currentProblem;
        
        resultMessage.className = `result-message ${isCorrect ? 'correct' : 'incorrect'}`;
        resultMessage.innerHTML = isCorrect
            ? `<div>正确！ ${num1} ${operation} ${num2} = ${answer}</div>`
            : `<div>加油！ ${num1} ${operation} ${num2} = ${answer}</div>`;
        
        resultMessage.style.display = 'block';
    }

    // 更新统计数据
    function updateStats() {
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('level').textContent = gameState.level;
        document.getElementById('streak').textContent = gameState.streak;
    }

    // 结束练习
    function endPractice() {
        gameState.isActive = false;
        answerInput.disabled = true;

        document.getElementById('finalScore').textContent = gameState.score;
        document.getElementById('finalLevel').textContent = gameState.level;
        document.getElementById('maxStreak').textContent = gameState.maxStreak;

        // 显示成就消息
        const achievementMessage = document.querySelector('.achievement-message');
        if (gameState.score >= 200) {
            achievementMessage.textContent = '🏆 数学小天才！';
        } else if (gameState.score >= 100) {
            achievementMessage.textContent = '🌟 练习达人！';
        } else {
            achievementMessage.textContent = '💪 继续加油！';
        }

        setTimeout(() => {
            practiceBoard.style.display = 'none';
            practiceResult.style.display = 'block';
        }, 1500);
    }

    // 初始化游戏
    init();
}); 