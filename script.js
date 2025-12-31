const quizQuestions = [
  { question: "What does HTML stand for?", options: ["Hyper Trainer Marking Language","Hyper Text Markup Language","High Text Machine Language","Hyper Text Machine Language"], answer: 1 },
  { question: "Which tag creates a hyperlink?", options: ["<a>","<link>","<href>","<url>"], answer: 0 },
  { question: "Which CSS property adds space inside?", options: ["margin","padding","border","gap"], answer: 1 },
  { question: "Which is a JavaScript keyword?", options: ["var","int","string","float"], answer: 0 },
  { question: "Which operator checks value & type?", options: ["==","===","=","!="], answer: 1 },
  { question: "Which event runs on click?", options: ["onclick","onload","onhover","onpress"], answer: 0 },
  { question: "Which layout is responsive?", options: ["float","flexbox","position","overflow"], answer: 1 },
  { question: "Which function shows alert?", options: ["alert()","msg()","popup()","show()"], answer: 0 },
  { question: "Which symbol is for comments?", options: ["//","<!-- -->","/* */","#"], answer: 0 },
  { question: "parseInt() does?", options: ["String to number","Number to string","Round","Boolean"], answer: 0 }
];

let index = 0;
let score = 0;
let answered = false;
let timeLeft = 30;
let timer;
let userAnswers = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const topBar = document.getElementById("top-bar");
const resultDetails = document.getElementById("result-details");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const restartBtn = document.getElementById("restart-btn");

startBtn.onclick = startQuiz;
nextBtn.onclick = nextQuestion;
skipBtn.onclick = skipQuestion;
restartBtn.onclick = restartQuiz;

function startQuiz() {
    startBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    skipBtn.style.display = "inline-block";
    topBar.style.display = "flex";
    loadQuestion();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerEl.textContent = `Time: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timer);
            skipQuestion();
        }
    }, 1000);
}

function loadQuestion() {
    answered = false;
    startTimer();

    const q = quizQuestions[index];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.classList.add("option-btn");
        btn.onclick = () => selectAnswer(i, btn);
        optionsEl.appendChild(btn);
    });
}

function selectAnswer(selected, btn) {
    if (answered) return;
    answered = true;
    clearInterval(timer);

    const correct = quizQuestions[index].answer;
    const buttons = document.querySelectorAll(".option-btn");

    userAnswers.push({
        question: quizQuestions[index].question,
        selected: quizQuestions[index].options[selected],
        correct: quizQuestions[index].options[correct]
    });

    buttons.forEach((b, i) => {
        if (i === correct) b.classList.add("correct");
        if (i === selected && i !== correct) b.classList.add("wrong");
        b.disabled = true;
    });

    if (selected === correct) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
    }
}

function nextQuestion() {
    index++;
    if (index < quizQuestions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function skipQuestion() {
    clearInterval(timer);
    userAnswers.push({
        question: quizQuestions[index].question,
        selected: "Skipped",
        correct: quizQuestions[index].options[quizQuestions[index].answer]
    });
    nextQuestion();
}

function showResult() {
    clearInterval(timer);
    questionEl.textContent = `Final Score: ${score}/10`;
    optionsEl.innerHTML = "";
    nextBtn.style.display = "none";
    skipBtn.style.display = "none";
    restartBtn.style.display = "inline-block";

    let message = "";
    if (score >= 8) message = "Excellent performance! 🚀";
    else if (score >= 6) message = "Good job! Keep improving 👍";
    else if (score >= 4) message = "Average performance. Practice more 🙂";
    else message = "Needs improvement. Keep learning 💪";

    questionEl.textContent += ` — ${message}`;

    resultDetails.innerHTML = "<h3>Detailed Answers:</h3>";
    userAnswers.forEach(a => {
        resultDetails.innerHTML += `
            <div class="result-question">
                <strong>${a.question}</strong><br>
                Your Answer: <span class="wrong-text">${a.selected}</span><br>
                Correct Answer: <span class="correct-text">${a.correct}</span>
            </div>
        `;
    });
}

function restartQuiz() {
    index = 0;
    score = 0;
    userAnswers = [];
    scoreEl.textContent = "Score: 0";
    resultDetails.innerHTML = "";
    restartBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    skipBtn.style.display = "inline-block";
    loadQuestion();
}
