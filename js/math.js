document.addEventListener('DOMContentLoaded', function() {
    const startMathBtn = document.getElementById('startMath');
    const checkAnswersBtn = document.getElementById('checkAnswers');
    const newProblemsBtn = document.getElementById('newProblems');
    const mathProblems = document.querySelector('.math-problems');
    const problemList = document.getElementById('problemList');
    const scoreDisplay = document.querySelector('.score-display');
    const currentScore = document.getElementById('currentScore');
    
    let usedProblems = new Set();
    let currentProblems = [];
    let score = 0;

    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');

    // 加载保存的设置
    loadSettings();

    // 设置按钮点击事件
    settingsBtn.addEventListener('click', function() {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
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
    });

    // 更新按钮显示状态
    function updateButtonsVisibility() {
        const hasProblems = problemList.children.length > 0;
        document.querySelector('.empty-state').style.display = hasProblems ? 'none' : 'block';
        problemList.style.display = hasProblems ? 'block' : 'none';
        
        // 只禁用检查答案按钮，新题目按钮始终可用
        checkAnswersBtn.disabled = !hasProblems;
        checkAnswersBtn.classList.toggle('button-disabled', !hasProblems);
        
        // 更新分数显示
        scoreDisplay.style.display = hasProblems ? 'block' : 'none';
    }

    // 修改 generateProblems 函数
    function generateProblems() {
        const allowAdd = document.getElementById('allowAddition').checked;
        const allowSub = document.getElementById('allowSubtraction').checked;
        const maxNumber = parseInt(document.getElementById('maxNumber').value) || 20;

        if (!allowAdd && !allowSub) {
            alert('请至少选择一种运算！');
            return;
        }

        mathProblems.style.display = 'block';
        scoreDisplay.style.display = 'block';
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

    // 修改检查答案函数
    function checkAnswers() {
        if (problemList.children.length === 0) {
            alert('请先点击右上角的设置按钮 ⚙️ 生成题目！');
            return;
        }

        const problems = problemList.querySelectorAll('.problem');
        let correct = 0;
        let unanswered = 0;

        problems.forEach(problem => {
            const input = problem.querySelector('input');
            const userAnswer = input.value.trim();
            const correctAnswer = parseInt(input.dataset.answer);

            problem.classList.remove('correct', 'incorrect');
            
            if (userAnswer === '') {
                unanswered++;
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

        if (unanswered > 0) {
            alert(`还有 ${unanswered} 道题没有回答，请完成所有题目后再检查答案！`);
            return;
        }

        score = correct;
        currentScore.textContent = score;
        
        const message = `答对了 ${correct} 题，共 ${problems.length} 题！`;
        if (correct === problems.length) {
            alert('太棒了！全部答对了！🎉');
        } else if (correct >= problems.length * 0.8) {
            alert('非常好！继续加油！👍\n' + message);
        } else {
            alert(message + '\n再试一次吧！💪');
        }
    }

    // 初始化页面状态
    updateButtonsVisibility();

    // 修改新题目按钮点击事件
    newProblemsBtn.addEventListener('click', function() {
        if (problemList.children.length > 0) {
            if (confirm('确定要生成新的题目吗？当前作答将会被清空。')) {
                settingsPanel.style.display = 'block';
            }
        } else {
            settingsPanel.style.display = 'block';
        }
    });
}); 