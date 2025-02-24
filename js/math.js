document.addEventListener('DOMContentLoaded', function() {
    const startMathBtn = document.getElementById('startMath');
    const checkAnswersBtn = document.getElementById('checkAnswers');
    const newProblemsBtn = document.getElementById('newProblems');
    const mathProblems = document.querySelector('.math-problems');
    const problemList = document.getElementById('problemList');
    const dailyChallengeBtn = document.getElementById('dailyChallenge');
    const calendarView = document.getElementById('calendarView');
    const calendarContent = document.querySelector('.calendar-content');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarTitle = document.querySelector('.calendar-title');
    
    let usedProblems = new Set();
    let currentProblems = [];
    let score = 0;
    let currentMode = 'practice'; // 'practice' 或 'challenge'
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let isGeneratingProblems = false;

    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const modeSelector = document.getElementById('modeSelector');
    const modeBtns = document.querySelectorAll('.mode-btn');

    // 加载保存的设置
    loadSettings();

    // 设置按钮点击事件
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSettings();
    });

    // 点击页面其他区域关闭设置面板
    document.addEventListener('click', function(e) {
        if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
            settingsPanel.style.display = 'none';
        }
    });

    // 阻止设置面板内的点击事件冒泡
    settingsPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 保存设置
    function saveSettings() {
        const settings = {
            allowAddition: document.getElementById('allowAddition').checked,
            allowSubtraction: document.getElementById('allowSubtraction').checked,
            maxNumber: document.getElementById('maxNumber').value
        };
        localStorage.setItem('mathSettings', JSON.stringify(settings));
    }

    // 加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('mathSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('allowAddition').checked = settings.allowAddition;
            document.getElementById('allowSubtraction').checked = settings.allowSubtraction;
            document.getElementById('maxNumber').value = settings.maxNumber;
        }
    }

    // 切换设置面板显示
    function toggleSettings() {
        const isHidden = settingsPanel.style.display === 'none';
        settingsPanel.style.display = isHidden ? 'block' : 'none';
        
        if (!isHidden && currentProblems.length > 0) {
            if (!confirm('打开设置将清空当前题目，确定要继续吗？')) {
                settingsPanel.style.display = 'none';
                return;
            }
            problemList.innerHTML = '';
            currentProblems = [];
            updateButtonsVisibility();
        }
    }

    // 验证设置
    function validateSettings() {
        return document.getElementById('allowAddition').checked || 
               document.getElementById('allowSubtraction').checked;
    }

    // 更新按钮显示状态
    function updateButtonsVisibility() {
        const hasProblems = currentProblems.length > 0;
        const emptyState = document.querySelector('.empty-state');
        emptyState.style.display = hasProblems ? 'none' : 'block';
        problemList.style.display = hasProblems ? 'block' : 'none';
        
        checkAnswersBtn.disabled = !hasProblems;
        checkAnswersBtn.classList.toggle('button-disabled', !hasProblems);
        
        // 在生成题目过程中禁用按钮
        if (isGeneratingProblems) {
            checkAnswersBtn.disabled = true;
            newProblemsBtn.disabled = true;
            startMathBtn.disabled = true;
        } else {
            newProblemsBtn.disabled = false;
            startMathBtn.disabled = false;
        }
    }

    // 生成每日挑战题目
    function generateDailyChallenge() {
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const savedChallenge = localStorage.getItem(`daily_challenge_${dateString}`);

        if (savedChallenge) {
            const challengeData = JSON.parse(savedChallenge);
            if (challengeData.completed) {
                alert('今天的挑战已经完成了！你的得分是：' + challengeData.score);
                showCalendar();
                return;
            }
        }

        // 使用日期作为随机种子
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        Math.seedrandom(seed.toString());

        mathProblems.style.display = 'block';
        problemList.innerHTML = '';
        currentProblems = [];
        usedProblems.clear();

        for (let i = 0; i < 10; i++) {
            const problem = generateDailyProblem();
            currentProblems.push(problem);
            const div = document.createElement('div');
            div.className = 'problem';
            div.innerHTML = `
                <span class="problem-text">${problem.a} ${problem.operation} ${problem.b} = </span>
                <input type="number" class="answer-input" data-index="${i}">
            `;
            problemList.appendChild(div);
        }

        updateButtonsVisibility();
        // 重置随机数生成器
        Math.seedrandom();
    }

    // 生成每日挑战题目
    function generateDailyProblem() {
        const operations = ['+', '-'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let a, b;

        do {
            if (operation === '+') {
                a = Math.floor(Math.random() * 51) + 1; // 1-51
                b = Math.floor(Math.random() * (100 - a)) + 1; // 确保和不超过100
            } else {
                a = Math.floor(Math.random() * 100) + 1; // 1-100
                b = Math.floor(Math.random() * a) + 1; // 确保差为正数
            }
        } while (usedProblems.has(`${a}${operation}${b}`));

        usedProblems.add(`${a}${operation}${b}`);
        return { a, b, operation };
    }

    // 修改 generateProblems 函数
    function generateProblems() {
        setGeneratingState(true);
        const allowAdd = document.getElementById('allowAddition').checked;
        const allowSub = document.getElementById('allowSubtraction').checked;
        const maxNumber = parseInt(document.getElementById('maxNumber').value) || 100;

        if (!allowAdd && !allowSub) {
            alert('请至少选择一种运算！');
            setGeneratingState(false);
            return;
        }

        mathProblems.style.display = 'block';
        calendarView.style.display = 'none';
        problemList.innerHTML = '';
        currentProblems = [];
        usedProblems.clear();

        for (let i = 0; i < 5; i++) {
            const problem = generateUniqueProblem(allowAdd, allowSub, maxNumber);
            if (problem) {
                currentProblems.push(problem);
                const div = document.createElement('div');
                div.className = 'problem';
                div.innerHTML = `
                    <span class="problem-text">${problem.a} ${problem.operation} ${problem.b} = </span>
                    <input type="number" class="answer-input" data-index="${i}">
                `;
                problemList.appendChild(div);
            }
        }

        updateButtonsVisibility();
        setGeneratingState(false);
    }

    function generateUniqueProblem(allowAdd, allowSub, maxNumber) {
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            const problem = generateProblem(allowAdd, allowSub, maxNumber);
            const key = `${problem.a}${problem.operation}${problem.b}`;

            if (!usedProblems.has(key)) {
                usedProblems.add(key);
                return problem;
            }

            attempts++;
        }

        return null;
    }

    function generateProblem(allowAdd, allowSub, maxNumber) {
        const operations = [];
        if (allowAdd) operations.push('+');
        if (allowSub) operations.push('-');
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let a, b;

        if (operation === '+') {
            a = Math.floor(Math.random() * (maxNumber / 2)) + 1;
            b = Math.floor(Math.random() * (maxNumber - a)) + 1;
        } else {
            a = Math.floor(Math.random() * maxNumber) + 1;
            b = Math.floor(Math.random() * a) + 1;
        }

        return { a, b, operation };
    }

    // 检查答案并保存每日挑战结果
    function checkAnswers(isDaily = false) {
        if (problemList.children.length === 0) {
            alert('请先点击"新的题目"按钮开始练习！');
            return;
        }

        let correct = 0;
        let total = currentProblems.length;
        let unanswered = [];

        currentProblems.forEach((problem, index) => {
            const input = problemList.querySelector(`input[data-index="${index}"]`);
            const answer = parseInt(input.value);
            const expectedAnswer = problem.operation === '+' 
                ? problem.a + problem.b 
                : problem.a - problem.b;

            const problemDiv = input.closest('.problem');
            problemDiv.classList.remove('correct', 'incorrect');

            if (isNaN(answer)) {
                unanswered.push(index + 1);
            } else if (answer === expectedAnswer) {
                problemDiv.classList.add('correct');
                correct++;
            } else {
                problemDiv.classList.add('incorrect');
            }
        });

        if (unanswered.length > 0) {
            alert(`第 ${unanswered.join('、')} 题还没有回答，请填写完整后再检查！`);
            return;
        }

        const score = Math.round((correct / total) * 100);
        const message = `得分：${score} 分\n答对了 ${correct} 题，共 ${total} 题！`;
        
        if (isDaily) {
            const today = new Date();
            saveDailyResult(today, score);
            showCalendar();
        }

        if (score === 100) {
            alert('太棒了！满分！🎉\n' + message);
        } else if (score >= 80) {
            alert('非常好！继续加油！👍\n' + message);
        } else {
            alert(message + '\n再试一次吧！💪');
        }
    }

    // 保存每日挑战结果
    function saveDailyResult(date, score) {
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const result = {
            completed: true,
            score: score,
            date: dateString
        };
        localStorage.setItem(`daily_challenge_${dateString}`, JSON.stringify(result));
    }

    // 显示每日挑战结果
    function showDailyResult(date) {
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const savedResult = localStorage.getItem(`daily_challenge_${dateString}`);
        if (savedResult) {
            const result = JSON.parse(savedResult);
            alert(`${dateString} 的得分：${result.score}`);
        }
    }

    // 显示日历视图
    function showCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();

        calendarTitle.textContent = `${currentYear}年${currentMonth + 1}月`;

        let html = `
            <div class="week-header">
                <div class="week-day">日</div>
                <div class="week-day">一</div>
                <div class="week-day">二</div>
                <div class="week-day">三</div>
                <div class="week-day">四</div>
                <div class="week-day">五</div>
                <div class="week-day">六</div>
            </div>
            <div class="days-grid">
        `;

        // 填充开始的空白日期
        for (let i = 0; i < startingDay; i++) {
            html += '<div class="day-cell empty"></div>';
        }

        // 填充日期
        for (let day = 1; day <= monthLength; day++) {
            const dateString = `${currentYear}-${currentMonth + 1}-${day}`;
            const challengeData = localStorage.getItem(`daily_challenge_${dateString}`);
            let cellClass = 'day-cell';
            let scoreHtml = '';

            if (challengeData) {
                const data = JSON.parse(challengeData);
                const score = data.score;
                if (score >= 90) cellClass += ' perfect';
                else if (score >= 70) cellClass += ' good';
                else cellClass += ' normal';
                scoreHtml = `<span class="score">${score}</span>`;
            }

            const today = new Date();
            if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                cellClass += ' today';
            }

            html += `
                <div class="${cellClass}">
                    ${day}
                    ${scoreHtml}
                </div>
            `;
        }

        // 填充结束的空白日期
        const totalCells = Math.ceil((startingDay + monthLength) / 7) * 7;
        for (let i = startingDay + monthLength; i < totalCells; i++) {
            html += '<div class="day-cell empty"></div>';
        }

        html += '</div>';
        calendarContent.innerHTML = html;

        // 添加日期点击事件
        const dayCells = calendarContent.querySelectorAll('.day-cell:not(.empty)');
        dayCells.forEach(cell => {
            cell.addEventListener('click', function() {
                const day = parseInt(this.textContent);
                const date = new Date(currentYear, currentMonth, day);
                showDailyResult(date);
            });
        });
    }

    // 切换模式
    function switchMode(mode) {
        currentMode = mode;
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // 重置问题列表
        problemList.innerHTML = '';
        currentProblems = [];
        
        // 更新UI状态
        updateButtonsVisibility();
        
        // 如果是挑战模式，检查今天是否已完成
        if (mode === 'challenge') {
            const today = new Date().toISOString().split('T')[0];
            const dailyResult = localStorage.getItem(`mathChallenge_${today}`);
            if (dailyResult) {
                showDailyResult(today);
                return;
            }
        }
    }

    // 生成题目时的状态控制
    function setGeneratingState(isGenerating) {
        isGeneratingProblems = isGenerating;
        updateButtonsVisibility();
    }

    // 初始化页面状态   
    updateButtonsVisibility();

    // 添加事件监听器
    checkAnswersBtn.addEventListener('click', () => checkAnswers(false));
    dailyChallengeBtn.addEventListener('click', generateDailyChallenge);
    document.getElementById('showCalendar').addEventListener('click', function() {
        settingsPanel.style.display = 'none';
        calendarView.style.display = calendarView.style.display === 'none' ? 'block' : 'none';
        if (calendarView.style.display === 'block') {
            showCalendar();
        }
    });

    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        showCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        showCalendar();
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentProblems.length > 0) {
                if (!confirm('切换模式将清空当前题目，确定要切换吗？')) {
                    return;
                }
            }
            switchMode(this.dataset.mode);
        });
    });

    // 修改新题目按钮点击事件
    newProblemsBtn.addEventListener('click', function() {
        if (isGeneratingProblems) return;
        if (currentProblems.length > 0) {
            if (!confirm('确定要生成新的题目吗？当前作答将会被清空。')) {
                return;
            }
        }
        generateProblems();
    });
}); 