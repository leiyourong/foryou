// 游戏状态
let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    startTime: null,
    timer: null,
    isPlaying: false,
    totalPairs: 0,
    settings: {
        difficulty: 'easy',
        showEnglish: true,
        showChinese: true,
        playSound: true
    }
};

// 难度设置
const DIFFICULTY_SETTINGS = {
    easy: { rows: 3, cols: 4 },
    medium: { rows: 4, cols: 4 },
    hard: { rows: 4, cols: 5 }
};

// DOM 元素
const elements = {
    gameBoard: document.querySelector('.game-board'),
    settingsPanel: document.getElementById('settingsPanel'),
    settingsBtn: document.getElementById('settingsBtn'),
    startGameBtn: document.getElementById('startGame'),
    timer: document.getElementById('timer'),
    moves: document.getElementById('moves'),
    matches: document.getElementById('matches'),
    gameResult: document.querySelector('.game-result'),
    playAgainBtn: document.getElementById('playAgain'),
    finalTime: document.getElementById('finalTime'),
    finalMoves: document.getElementById('finalMoves'),
    finalScore: document.getElementById('finalScore')
};

// 初始化游戏
function initGame() {
    // 绑定设置面板事件
    elements.settingsBtn.addEventListener('click', toggleSettings);
    elements.startGameBtn.addEventListener('click', startNewGame);
    elements.playAgainBtn.addEventListener('click', () => {
        elements.gameResult.style.display = 'none';
        toggleSettings();
    });

    // 绑定设置选项事件
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            gameState.settings.difficulty = e.target.value;
        });
    });

    document.getElementById('showEnglish').addEventListener('change', (e) => {
        gameState.settings.showEnglish = e.target.checked;
        if (!e.target.checked && !document.getElementById('showChinese').checked) {
            document.getElementById('showChinese').checked = true;
            gameState.settings.showChinese = true;
        }
    });

    document.getElementById('showChinese').addEventListener('change', (e) => {
        gameState.settings.showChinese = e.target.checked;
        if (!e.target.checked && !document.getElementById('showEnglish').checked) {
            document.getElementById('showEnglish').checked = true;
            gameState.settings.showEnglish = true;
        }
    });

    document.getElementById('playSound').addEventListener('change', (e) => {
        gameState.settings.playSound = e.target.checked;
    });

    // 显示设置面板
    toggleSettings();
}

// 切换设置面板
function toggleSettings() {
    const isHidden = elements.settingsPanel.style.display === 'none';
    elements.settingsPanel.style.display = isHidden ? 'block' : 'none';
    if (!isHidden && gameState.isPlaying) {
        if (confirm('切换到设置将结束当前游戏，确定要继续吗？')) {
            resetGameState();
        } else {
            elements.settingsPanel.style.display = 'none';
        }
    }
}

// 开始新游戏
function startNewGame() {
    // 检查设置是否有效
    if (!gameState.settings.showEnglish && !gameState.settings.showChinese) {
        alert('请至少选择显示英文或中文其中之一');
        return;
    }

    // 重置游戏状态
    resetGameState();
    
    // 获取难度设置
    const { rows, cols } = DIFFICULTY_SETTINGS[gameState.settings.difficulty];
    gameState.totalPairs = (rows * cols) / 2;
    
    // 准备卡片数据
    const words = getRandomWords(gameState.totalPairs);
    const cards = prepareCards(words);
    
    // 设置游戏面板
    setupGameBoard(rows, cols);
    
    // 创建卡片元素
    createCards(cards);
    
    // 开始计时
    startTimer();
    
    // 隐藏设置面板
    elements.settingsPanel.style.display = 'none';
    
    // 设置游戏状态
    gameState.isPlaying = true;
}

// 重置游戏状态
function resetGameState() {
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.startTime = null;
    gameState.isPlaying = false;
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    elements.moves.textContent = '0';
    elements.matches.textContent = '0';
    elements.timer.textContent = '00:00';
    elements.gameBoard.innerHTML = '';
    elements.gameResult.style.display = 'none';
}

// 获取随机单词
function getRandomWords(count) {
    // 从词汇表中获取随机单词
    const allWords = [];
    Object.values(vocabularyData).forEach(lesson => {
        lesson.forEach(word => {
            allWords.push(word);
        });
    });
    
    // 随机打乱并选择指定数量的单词
    return shuffleArray(allWords).slice(0, count);
}

// 准备卡片数据
function prepareCards(words) {
    const cards = [];
    words.forEach(word => {
        // 创建匹配对
        cards.push(
            { id: cards.length, word: word, isMatched: false },
            { id: cards.length + 1, word: word, isMatched: false }
        );
    });
    return shuffleArray(cards);
}

// 设置游戏面板
function setupGameBoard(rows, cols) {
    elements.gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    elements.gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}

// 创建卡片元素
function createCards(cards) {
    gameState.cards = cards;
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        elements.gameBoard.appendChild(cardElement);
    });
}

// 创建单个卡片元素
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'memory-card';
    cardElement.dataset.id = card.id;
    
    // 卡片正面（单词面）
    const frontFace = document.createElement('div');
    frontFace.className = 'card-face card-front';
    
    if (gameState.settings.showEnglish) {
        const englishText = document.createElement('div');
        englishText.className = 'card-english';
        englishText.textContent = card.word.english;
        frontFace.appendChild(englishText);
    }
    
    if (gameState.settings.showChinese) {
        const chineseText = document.createElement('div');
        chineseText.className = 'card-chinese';
        chineseText.textContent = card.word.chinese;
        frontFace.appendChild(chineseText);
    }
    
    // 卡片背面
    const backFace = document.createElement('div');
    backFace.className = 'card-face card-back';
    backFace.textContent = '🎴';
    
    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);
    
    // 添加点击事件
    cardElement.addEventListener('click', () => handleCardClick(cardElement, card));
    
    return cardElement;
}

// 处理卡片点击
function handleCardClick(cardElement, card) {
    if (!gameState.isPlaying || 
        gameState.flippedCards.length >= 2 || 
        cardElement.classList.contains('flipped') ||
        card.isMatched) {
        return;
    }
    
    // 翻转卡片
    flipCard(cardElement);
    gameState.flippedCards.push({ element: cardElement, card: card });
    
    // 播放单词发音
    if (gameState.settings.playSound && gameState.flippedCards.length === 1) {
        speakWord(card.word.english);
    }
    
    // 检查配对
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        elements.moves.textContent = gameState.moves;
        checkMatch();
    }
}

// 翻转卡片
function flipCard(cardElement) {
    cardElement.classList.add('flipped');
}

// 检查配对
function checkMatch() {
    const [firstCard, secondCard] = gameState.flippedCards;
    const isMatch = firstCard.card.word.english === secondCard.card.word.english;
    
    if (isMatch) {
        handleMatch(firstCard, secondCard);
    } else {
        handleMismatch(firstCard, secondCard);
    }
}

// 处理配对成功
function handleMatch(firstCard, secondCard) {
    firstCard.card.isMatched = true;
    secondCard.card.isMatched = true;
    
    firstCard.element.classList.add('matched');
    secondCard.element.classList.add('matched');
    
    gameState.matchedPairs++;
    elements.matches.textContent = gameState.matchedPairs;
    
    gameState.flippedCards = [];
    
    // 检查游戏是否结束
    if (gameState.matchedPairs === gameState.totalPairs) {
        endGame();
    }
}

// 处理配对失败
function handleMismatch(firstCard, secondCard) {
    setTimeout(() => {
        firstCard.element.classList.remove('flipped');
        secondCard.element.classList.remove('flipped');
        gameState.flippedCards = [];
    }, 1000);
}

// 开始计时器
function startTimer() {
    gameState.startTime = Date.now();
    gameState.timer = setInterval(updateTimer, 1000);
}

// 更新计时器
function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    elements.timer.textContent = `${padNumber(minutes)}:${padNumber(seconds)}`;
}

// 数字补零
function padNumber(number) {
    return number.toString().padStart(2, '0');
}

// 结束游戏
function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timer);
    
    const finalTime = elements.timer.textContent;
    const finalMoves = gameState.moves;
    const timeBonus = Math.max(0, 1000 - Math.floor((Date.now() - gameState.startTime) / 1000));
    const movesPenalty = gameState.moves * 10;
    const finalScore = Math.max(0, 1000 + timeBonus - movesPenalty);
    
    elements.finalTime.textContent = finalTime;
    elements.finalMoves.textContent = finalMoves;
    elements.finalScore.textContent = finalScore;
    
    elements.gameResult.style.display = 'block';
}

// 数组随机打乱
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame); 