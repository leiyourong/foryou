document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const mainContentPanel = document.getElementById('mainContent');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const showTranslation = document.getElementById('showTranslation');
    const readChinese = document.getElementById('readChinese');
    const studyModeInputs = document.getElementsByName('studyMode');
    const quizSettings = document.getElementById('quizSettings');
    const questionCount = document.getElementById('questionCount');
    const learnMode = document.getElementById('learnMode');
    const quizMode = document.getElementById('quizMode');
    const lessonTabs = document.querySelectorAll('.lesson-tab');
    const wordList = document.querySelector('.word-list');
    const quizContainer = document.querySelector('.quiz-container');
    const quizResult = document.querySelector('.quiz-result');
    const retryQuiz = document.getElementById('retryQuiz');

    let currentLesson = 1;
    let currentQuiz = null;

    // 加载设置
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('vocabularySettings')) || {
            showTranslation: true,
            readChinese: true,
            studyMode: 'learn',
            quizRange: 'current',
            questionCount: 10
        };

        showTranslation.checked = settings.showTranslation;
        readChinese.checked = settings.readChinese;
        document.querySelector(`input[name="studyMode"][value="${settings.studyMode}"]`).checked = true;
        document.querySelector(`input[name="quizRange"][value="${settings.quizRange}"]`).checked = true;
        questionCount.value = settings.questionCount;

        updateMode(settings.studyMode);
    }

    // 保存设置
    function saveSettings() {
        const settings = {
            showTranslation: showTranslation.checked,
            readChinese: readChinese.checked,
            studyMode: document.querySelector('input[name="studyMode"]:checked').value,
            quizRange: document.querySelector('input[name="quizRange"]:checked').value,
            questionCount: parseInt(questionCount.value)
        };
        localStorage.setItem('vocabularySettings', JSON.stringify(settings));
    }

    // 更新学习模式
    function updateMode(mode) {
        mainContentPanel.style.display = 'block';
        
        if (mode === 'learn') {
            learnMode.classList.add('active');
            quizMode.classList.remove('active');
            quizSettings.style.display = 'none';
            displayWords(currentLesson);
        } else {
            learnMode.classList.remove('active');
            quizMode.classList.add('active');
            quizSettings.style.display = 'block';
            startQuiz();
        }
        // 隐藏设置面板
        settingsPanel.style.display = 'none';
    }

    // 显示单词列表
    function displayWords(lessonId) {
        const lesson = vocabularyData[`lesson${lessonId}`];
        if (!lesson) return;

        wordList.innerHTML = '';
        lesson.forEach(word => {
            const wordCard = document.createElement('div');
            wordCard.className = 'word-card';
            wordCard.innerHTML = `
                <div class="word-english">
                    ${word.english}
                    <button class="play-button" onclick="speakWord('${word.english}', 'en')">🔊</button>
                </div>
                <div class="word-phonetic">${word.phonetic}</div>
                <div class="word-chinese" style="display: ${showTranslation.checked ? 'block' : 'none'}">
                    ${word.chinese}
                </div>
            `;
            wordList.appendChild(wordCard);
        });
    }

    // 开始测试
    function startQuiz() {
        const quizRange = document.querySelector('input[name="quizRange"]:checked').value;
        const count = parseInt(questionCount.value);
        
        // 获取测试单词
        let words = [];
        if (quizRange === 'current') {
            words = vocabularyData[`lesson${currentLesson}`];
        } else {
            Object.values(vocabularyData).forEach(lesson => {
                words = words.concat(lesson);
            });
        }

        // 随机选择单词
        const quizWords = [];
        while (quizWords.length < count && words.length > 0) {
            const index = Math.floor(Math.random() * words.length);
            quizWords.push(words.splice(index, 1)[0]);
        }

        currentQuiz = {
            words: quizWords,
            currentIndex: 0,
            correctCount: 0
        };

        showQuestion();
    }

    // 显示问题
    function showQuestion() {
        if (!currentQuiz || currentQuiz.currentIndex >= currentQuiz.words.length) {
            showQuizResult();
            return;
        }

        const word = currentQuiz.words[currentQuiz.currentIndex];
        const options = generateOptions(word);

        document.getElementById('currentQuestion').textContent = currentQuiz.currentIndex + 1;
        document.getElementById('totalQuestions').textContent = currentQuiz.words.length;

        const quizWord = document.querySelector('.quiz-word');
        quizWord.innerHTML = `
            <button class="play-button large" onclick="speakWord('${word.english}', 'en')">🔊</button>
            <div class="quiz-word-text">${word.english}</div>
            <div class="quiz-word-phonetic">${word.phonetic}</div>
            <div class="quiz-progress">第 <span id="currentQuestion">${currentQuiz.currentIndex + 1}</span> 题，共 <span id="totalQuestions">${currentQuiz.words.length}</span> 题</div>
        `;

        const quizOptions = document.querySelector('.quiz-options');
        quizOptions.innerHTML = '';

        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option.chinese;
            button.onclick = () => checkAnswer(option.english === word.english);
            quizOptions.appendChild(button);
        });
    }

    // 生成选项
    function generateOptions(correctWord) {
        const options = [correctWord];
        const allWords = [];
        Object.values(vocabularyData).forEach(lesson => {
            allWords.push(...lesson);
        });

        while (options.length < 4) {
            const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
            if (!options.find(w => w.english === randomWord.english)) {
                options.push(randomWord);
            }
        }

        return shuffleArray(options);
    }

    // 检查答案
    function checkAnswer(isCorrect) {
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.disabled = true;
            if (option.textContent === currentQuiz.words[currentQuiz.currentIndex].chinese) {
                option.classList.add('correct');
            } else 
            if (option === event.target && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            currentQuiz.correctCount++;
        }

        setTimeout(() => {
            currentQuiz.currentIndex++;
            showQuestion();
        }, 1500);
    }

    // 显示测试结果
    function showQuizResult() {
        const resultContent = document.querySelector('.result-content');
        const percentage = Math.round((currentQuiz.correctCount / currentQuiz.words.length) * 100);
        
        resultContent.innerHTML = `
            <div class="result-score">得分：${percentage}%</div>
            <div class="result-detail">
                答对：${currentQuiz.correctCount} 题
                答错：${currentQuiz.words.length - currentQuiz.correctCount} 题
            </div>
        `;

        quizContainer.style.display = 'none';
        quizResult.style.display = 'block';
    }

    // 工具函数：随机排序数组
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 事件监听器
    settingsBtn.addEventListener('click', () => {
        const isHide = settingsPanel.style.display === 'none'
        settingsPanel.style.display = isHide ? 'block' : 'none';
        mainContentPanel.style.display = isHide ? 'none' : 'block';
    });

    // 点击设置面板外的区域关闭设置
    document.addEventListener('click', (event) => {
        if (!settingsPanel.contains(event.target) && event.target !== settingsBtn) {
            settingsPanel.style.display = 'none';
        }
    });

    // 阻止设置面板内的点击事件冒泡
    settingsPanel.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    showTranslation.addEventListener('change', () => {
        document.querySelectorAll('.word-chinese').forEach(el => {
            el.style.display = showTranslation.checked ? 'block' : 'none';
        });
        saveSettings();
    });

    [readChinese].forEach(input => {
        input.addEventListener('change', () => {
            saveSettings();
            if (document.querySelector('input[name="studyMode"]:checked').value === 'learn') {
                displayWords(currentLesson);
            }
        });
    });

    studyModeInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateMode(input.value);
            saveSettings();
        });
    });

    lessonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            lessonTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentLesson = parseInt(tab.dataset.lesson);
            if (document.querySelector('input[name="studyMode"]:checked').value === 'learn') {
                displayWords(currentLesson);
            }
        });
    });

    retryQuiz.addEventListener('click', () => {
        quizResult.style.display = 'none';
        quizContainer.style.display = 'block';
        startQuiz();
    });

    // 修复单词发音功能
    window.speakWord = function(text, lang) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    // 初始化
    loadSettings();
}); 