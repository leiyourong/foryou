document.addEventListener('DOMContentLoaded', function() {
    const startMathBtn = document.getElementById('startMath');
    const checkAnswersBtn = document.getElementById('checkAnswers');
    const newProblemsBtn = document.getElementById('newProblems');
    const mathProblems = document.querySelector('.math-problems');
    const problemList = document.getElementById('problemList');
    const dailyChallengeBtn = document.getElementById('dailyChallenge');
    const calendarView = document.getElementById('calendarView');
    
    let usedProblems = new Set();
    let currentProblems = [];
    let score = 0;

    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');

    // 加载保存的设置
    loadSettings();

    // 设置按钮点击事件
    settingsBtn.addEventListener('click', function() {
        const isHide = settingsPanel.style.display === 'none'
        settingsPanel.style.display = isHide ? 'block' : 'none';
        mathProblems.style.display = isHide ? 'none' : 'block';
        calendarView.style.display = 'none';
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

    // 在开始练习时保存设置
    startMathBtn.addEventListener('click', function() {
        saveSettings();
        generateProblems();
        settingsPanel.style.display = 'none';
        calendarView.style.display = 'none';
    });

    // 更新按钮显示状态
    function updateButtonsVisibility() {
        const hasProblems = problemList.children.length > 0;
        document.querySelector('.empty-state').style.display = hasProblems ? 'none' : 'block';
        problemList.style.display = hasProblems ? 'block' : 'none';
        
        // 只禁用检查答案按钮，新题目按钮始终可用
        checkAnswersBtn.disabled = !hasProblems;
        checkAnswersBtn.classList.toggle('button-disabled', !hasProblems);
    }

    // 生成每日挑战题目
    function generateDailyChallenge() {
        const today = new Date().toLocaleDateString();
        const lastChallenge = localStorage.getItem('lastDailyChallenge');
        
        if (lastChallenge === today) {
            alert('今天的挑战已完成，请明天再来！');
            showDailyResult(today);
            return;
        }

        // 使用日期作为随机种子
        const seed = new Date().toISOString().split('T')[0];
        Math.seedrandom(seed);

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
                <span class="problem-text">${problem.text}</span>
                <input type="number" data-answer="${problem.answer}" />
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
        let num1, num2, answer;

        if (operation === '+') {
            num1 = Math.floor(Math.random() * 99) + 1;
            num2 = Math.floor(Math.random() * (100 - num1)) + 1;
            answer = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * 98) + 2;
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            answer = num1 - num2;
        }

        return {
            num1: num1,
            num2: num2,
            operation: operation,
            text: `${num1} ${operation} ${num2} = `,
            answer: answer
        };
    }

    // 修改 generateProblems 函数
    function generateProblems() {
        const allowAdd = document.getElementById('allowAddition').checked;
        const allowSub = document.getElementById('allowSubtraction').checked;
        const maxNumber = parseInt(document.getElementById('maxNumber').value) || 100;

        if (!allowAdd && !allowSub) {
            alert('请至少选择一种运算！');
            return;
        }

        mathProblems.style.display = 'block';
        calendarView.style.display = 'none';
        problemList.innerHTML = '';
        currentProblems = [];
        usedProblems.clear();

        for (let i = 0; i < 10; i++) {
            const problem = generateUniqueProblem(allowAdd, allowSub, maxNumber);
            currentProblems.push(problem);
            const div = document.createElement('div');
            div.className = 'problem';
            div.innerHTML = `
                <span class="problem-text">${problem.text}</span>
                <input type="number" data-answer="${problem.answer}" />
            `;
            problemList.appendChild(div);
        }

        updateButtonsVisibility();
    }

    function generateUniqueProblem(allowAdd, allowSub, maxNumber) {
        let problem;
        let problemKey;
        do {
            problem = generateProblem(allowAdd, allowSub, maxNumber);
            problemKey = `${problem.num1}${problem.operation}${problem.num2}`;
        } while (usedProblems.has(problemKey));
        
        usedProblems.add(problemKey);
        return problem;
    }

    function generateProblem(allowAdd, allowSub, maxNumber) {
        const operations = [];
        if (allowAdd) operations.push('+');
        if (allowSub) operations.push('-');
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer;

        if (operation === '+') {
            num1 = Math.floor(Math.random() * (maxNumber - 1)) + 1;
            num2 = Math.floor(Math.random() * (maxNumber - num1)) + 1;
            answer = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * (maxNumber - 1)) + 2;
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            answer = num1 - num2;
        }

        return {
            num1: num1,
            num2: num2,
            operation: operation,
            text: `${num1} ${operation} ${num2} = `,
            answer: answer
        };
    }

    // 检查答案并保存每日挑战结果
    function checkAnswers(isDaily = false) {
        if (problemList.children.length === 0) {
            alert('请先点击"新的题目"按钮开始练习！');
            return;
        }

        const problems = problemList.querySelectorAll('.problem');
        let correct = 0;
        let unanswered = [];

        problems.forEach((problem, index) => {
            const input = problem.querySelector('input');
            const userAnswer = input.value.trim();
            const correctAnswer = parseInt(input.dataset.answer);

            problem.classList.remove('correct', 'incorrect');
            
            if (userAnswer === '') {
                unanswered.push(index + 1);
            } else {
                const numAnswer = parseInt(userAnswer);
                if (numAnswer === correctAnswer) {
                    problem.classList.add('correct');
                    correct++;
                } else {
                    problem.classList.add('incorrect');
                }
            }
        });

        if (unanswered.length > 0) {
            alert(`第 ${unanswered.join('、')} 题还没有回答，请填写完所有题目后再检查答案！`);
            return;
        }

        const score = correct * 10;
        const message = `本次得分：${score} 分\n答对了 ${correct} 题，共 ${problems.length} 题！`;
        
        if (isDaily) {
            const today = new Date().toLocaleDateString();
            saveDailyResult(today, score);
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
        const results = JSON.parse(localStorage.getItem('dailyChallengeResults') || '{}');
        results[date] = score;
        localStorage.setItem('dailyChallengeResults', JSON.stringify(results));
        localStorage.setItem('lastDailyChallenge', date);
    }

    // 显示每日挑战结果
    function showDailyResult(date) {
        const results = JSON.parse(localStorage.getItem('dailyChallengeResults') || '{}');
        const score = results[date];
        if (score !== undefined) {
            alert(`今日挑战得分：${score} 分`);
        }
    }

    // 显示日历视图
    function showCalendar() {
        const results = JSON.parse(localStorage.getItem('dailyChallengeResults') || '{}');
        const calendar = document.createElement('div');
        calendar.className = 'calendar-grid';

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        // 添加日历标题
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        calendar.innerHTML = `<h3>${monthNames[currentMonth]} ${currentYear}</h3>`;

        // 添加星期标题
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekHeader = document.createElement('div');
        weekHeader.className = 'week-header';
        weekDays.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'week-day';
            dayCell.textContent = day;
            weekHeader.appendChild(dayCell);
        });
        calendar.appendChild(weekHeader);

        // 添加日期格子
        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        // 添加空白格子
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            daysGrid.appendChild(emptyCell);
        }

        // 添加日期
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateString = date.toLocaleDateString();
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            const score = results[dateString];
            if (score !== undefined) {
                dayCell.classList.add(score === 100 ? 'perfect' : score >= 80 ? 'good' : 'normal');
                dayCell.innerHTML = `${day}<span class="score">${score}</span>`;
            } else {
                dayCell.textContent = day;
            }

            if (dateString === today.toLocaleDateString()) {
                dayCell.classList.add('today');
            }

            daysGrid.appendChild(dayCell);
        }

        calendar.appendChild(daysGrid);
        calendarView.innerHTML = '';
        calendarView.appendChild(calendar);
        calendarView.style.display = 'block';
        mathProblems.style.display = 'none';
        settingsPanel.style.display = 'none';
    }

    // 初始化页面状态   
    updateButtonsVisibility();

    // 添加事件监听器
    checkAnswersBtn.addEventListener('click', () => checkAnswers(false));
    dailyChallengeBtn.addEventListener('click', generateDailyChallenge);
    document.getElementById('showCalendar').addEventListener('click', showCalendar);

    // 修改新题目按钮点击事件
    newProblemsBtn.addEventListener('click', function() {
        if (problemList.children.length > 0) {
            if (confirm('确定要生成新的题目吗？当前作答将会被清空。')) {
                generateProblems();
            }
        } else {
            generateProblems();
        }
    });
}); 