document.addEventListener('DOMContentLoaded', function() {
    const startMathBtn = document.getElementById('startMath');
    const checkAnswersBtn = document.getElementById('checkAnswers');
    const newProblemsBtn = document.getElementById('newProblems');
    const mathProblems = document.querySelector('.math-problems');
    const problemList = document.getElementById('problemList');

    startMathBtn.addEventListener('click', generateProblems);
    checkAnswersBtn.addEventListener('click', checkAnswers);
    newProblemsBtn.addEventListener('click', generateProblems);

    function generateProblems() {
        const allowAdd = document.getElementById('allowAddition').checked;
        const allowSub = document.getElementById('allowSubtraction').checked;
        const maxNumber = parseInt(document.getElementById('maxNumber').value) || 20;

        if (!allowAdd && !allowSub) {
            alert('请至少选择一种运算！');
            return;
        }

        mathProblems.style.display = 'block';
        problemList.innerHTML = '';

        for (let i = 0; i < 10; i++) {
            const problem = generateProblem(allowAdd, allowSub, maxNumber);
            const div = document.createElement('div');
            div.className = 'problem';
            div.innerHTML = `
                <span>${problem.text}</span>
                <input type="number" data-answer="${problem.answer}" />
            `;
            problemList.appendChild(div);
        }
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
            text: `${num1} ${operation} ${num2} = `,
            answer: answer
        };
    }

    function checkAnswers() {
        const problems = problemList.querySelectorAll('.problem');
        let correct = 0;

        problems.forEach(problem => {
            const input = problem.querySelector('input');
            const userAnswer = parseInt(input.value);
            const correctAnswer = parseInt(input.dataset.answer);

            problem.classList.remove('correct', 'incorrect');
            if (!isNaN(userAnswer)) {
                if (userAnswer === correctAnswer) {
                    problem.classList.add('correct');
                    correct++;
                } else {
                    problem.classList.add('incorrect');
                }
            }
        });

        alert(`答对了 ${correct} 题，共 ${problems.length} 题！`);
    }
}); 