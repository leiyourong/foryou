document.addEventListener('DOMContentLoaded', function() {
    const startEnglishBtn = document.getElementById('startEnglish');
    const checkAnswersBtn = document.getElementById('checkAnswers');
    const newProblemsBtn = document.getElementById('newProblems');
    const problemList = document.getElementById('problemList');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const englishProblems = document.querySelector('.english-problems');

    let currentProblems = [];
    let audioContext = null;

    // 字母音频数据
    const letterSounds = {
        'A': 'path/to/A.mp3',
        // ... 其他字母的音频文件路径
    };

    // 加载保存的设置
    loadSettings();

    // 设置按钮点击事件
    settingsBtn.addEventListener('click', function() {
        const isHide = settingsPanel.style.display === 'none';
        settingsPanel.style.display = isHide ? 'block' : 'none';
        englishProblems.style.display = isHide ? 'none' : 'block';
    });

    // 保存设置
    function saveSettings() {
        const settings = {
            includeUpperCase: document.getElementById('includeUpperCase').checked,
            includeLowerCase: document.getElementById('includeLowerCase').checked
        };
        localStorage.setItem('englishSettings', JSON.stringify(settings));
    }

    // 加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('englishSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('includeUpperCase').checked = settings.includeUpperCase;
            document.getElementById('includeLowerCase').checked = settings.includeLowerCase;
        }
    }

    // 生成随机字母
    function generateRandomLetter(upperCase, lowerCase) {
        const letters = [];
        if (upperCase) letters.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (lowerCase) letters.push(...'abcdefghijklmnopqrstuvwxyz');
        return letters[Math.floor(Math.random() * letters.length)];
    }

    // 更新字母音频相关代码
    function getLetterDescription(letter) {
        const isUpperCase = letter === letter.toUpperCase();
        return `${isUpperCase ? 'big' : 'small'} ${letter.toUpperCase()}`;
    }

    // 播放字母音频
    function playLetterSound(letter) {
        if ('speechSynthesis' in window) {
            SpeechService.playLetter(letter);
        } else {
            console.log('浏览器不支持语音合成');
        }
    }

    // 更新生成相似字母选项的函数
    function generateSimilarLetters(letter) {
        const similarLetters = {
            'A': ['a', 'R', 'H', 'V'],
            'B': ['b', 'P', 'R', 'D'],
            'C': ['c', 'G', 'O', 'Q'],
            'D': ['d', 'B', 'P', 'O'],
            'E': ['e', 'F', 'B', 'P'],
            'F': ['f', 'E', 'P', 'T'],
            'G': ['g', 'C', 'O', 'Q'],
            'H': ['h', 'A', 'N', 'M'],
            'I': ['i', 'l', 'T', 'J'],
            'J': ['j', 'I', 'L', 'T'],
            'K': ['k', 'R', 'X', 'Y'],
            'L': ['l', 'I', 'T', 'J'],
            'M': ['m', 'N', 'W', 'H'],
            'N': ['n', 'M', 'H', 'U'],
            'O': ['o', 'Q', 'C', 'G'],
            'P': ['p', 'B', 'R', 'D'],
            'Q': ['q', 'O', 'G', 'C'],
            'R': ['r', 'P', 'B', 'K'],
            'S': ['s', 'Z', '5', '2'],
            'T': ['t', 'I', 'L', 'J'],
            'U': ['u', 'V', 'Y', 'N'],
            'V': ['v', 'U', 'Y', 'A'],
            'W': ['w', 'M', 'V', 'U'],
            'X': ['x', 'K', 'Y', 'Z'],
            'Y': ['y', 'V', 'U', 'X'],
            'Z': ['z', 'S', '2', 'N']
        };

        // 获取当前字母的大小写形式
        const upperLetter = letter.toUpperCase();
        const lowerLetter = letter.toLowerCase();
        
        // 确保选项中包含当前字母
        const options = [letter];
        
        // 获取相似字母列表
        const similar = similarLetters[upperLetter] || [];
        
        // 如果当前是大写字母，确保包含其小写形式
        if (letter === upperLetter && !options.includes(lowerLetter)) {
            options.push(lowerLetter);
        }
        // 如果当前是小写字母，确保包含其大写形式
        if (letter === lowerLetter && !options.includes(upperLetter)) {
            options.push(upperLetter);
        }
        
        // 从相似字母中随机选择填充剩余选项
        while (options.length < 4) {
            const randomSimilar = similar[Math.floor(Math.random() * similar.length)];
            if (!options.includes(randomSimilar)) {
                options.push(randomSimilar);
            }
        }
        
        return shuffleArray(options);
    }

    // 打乱数组
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 生成问题
    function generateProblems() {
        const upperCase = document.getElementById('includeUpperCase').checked;
        const lowerCase = document.getElementById('includeLowerCase').checked;

        if (!upperCase && !lowerCase) {
            alert('请至少选择一种字母类型！');
            return;
        }

        problemList.innerHTML = '';
        currentProblems = [];

        for (let i = 0; i < 10; i++) {
            const letter = generateRandomLetter(upperCase, lowerCase);
            const options = generateSimilarLetters(letter);
            
            const problem = {
                letter: letter,
                options: options,
                answer: letter
            };
            
            currentProblems.push(problem);
            
            const div = document.createElement('div');
            div.className = 'problem english-problem';
            div.innerHTML = `
                <div class="letter-display">
                    <button class="play-sound" data-letter="${letter}">
                        <span class="play-icon">🔊</span>
                        <span class="play-text">Listen</span>
                    </button>
                </div>
                <div class="options-grid">
                    ${options.map((opt, index) => `
                        <label class="option">
                            <input type="radio" name="problem${i}" value="${opt}">
                            <span class="option-text">${opt}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            problemList.appendChild(div);
        }

        // 添加音频播放事件
        document.querySelectorAll('.play-sound').forEach(button => {
            button.addEventListener('click', function() {
                playLetterSound(this.dataset.letter);
            });
        });

        updateButtonsVisibility();
    }

    // 检查答案
    function checkAnswers() {
        if (problemList.children.length === 0) {
            alert('请先点击"新的题目"按钮开始练习！');
            return;
        }

        const problems = problemList.querySelectorAll('.english-problem');
        let correct = 0;
        let unanswered = [];

        problems.forEach((problem, index) => {
            const selectedOption = problem.querySelector('input:checked');
            const correctAnswer = currentProblems[index].answer;

            problem.classList.remove('correct', 'incorrect');
            
            if (!selectedOption) {
                unanswered.push(index + 1);
            } else if (selectedOption.value === correctAnswer) {
                problem.classList.add('correct');
                correct++;
            } else {
                problem.classList.add('incorrect');
            }
        });

        if (unanswered.length > 0) {
            alert(`第 ${unanswered.join('、')} 题还没有回答，请选择答案后再检查！`);
            return;
        }

        const score = correct * 10;
        const message = `本次得分：${score} 分\n答对了 ${correct} 题，共 ${problems.length} 题！`;
        
        if (score === 100) {
            SpeechService.playCongratulations();
            alert('太棒了！满分！🎉\n' + message);
        } else if (score >= 80) {
            alert('非常好！继续加油！👍\n' + message);
        } else {
            alert(message + '\n再试一次吧！💪');
        }
    }

    // 更新按钮状态
    function updateButtonsVisibility() {
        const hasProblems = problemList.children.length > 0;
        document.querySelector('.empty-state').style.display = hasProblems ? 'none' : 'block';
        problemList.style.display = hasProblems ? 'block' : 'none';
        
        checkAnswersBtn.disabled = !hasProblems;
        checkAnswersBtn.classList.toggle('button-disabled', !hasProblems);
    }

    // 事件监听
    startEnglishBtn.addEventListener('click', function() {
        saveSettings();
        generateProblems();
        settingsPanel.style.display = 'none';
    });

    checkAnswersBtn.addEventListener('click', checkAnswers);

    newProblemsBtn.addEventListener('click', function() {
        if (problemList.children.length > 0) {
            if (confirm('确定要生成新的题目吗？当前作答将会被清空。')) {
                generateProblems();
            }
        } else {
            generateProblems();
        }
    });

    // 初始化
    updateButtonsVisibility();
}); 