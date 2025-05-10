let category = document.querySelectorAll(".category button");
let choosePage = document.querySelector(".choose-page");
let quizzArea = document.querySelector(".quizz-area");
let mainQuestion = document.querySelector(".quizz-area h2");
let submitButton = document.querySelector("button.submit");
let countBorder = document.querySelector("p.time");
let theSilder = document.querySelector(".slider");
let answers = document.querySelectorAll(".answers p");
let countdownElement = document.querySelector(".time");
let resultArea = document.querySelector(".result-area");
let ball = document.querySelector(".ball");
let currentQuestion = 0;
const QUESTIONNUMBER = 10;
const ANSWERSNUMBER = 3;
let selectedAnswer = "";
let theScore = 0;
let slider = 0;
let countdownInterval;
let TIME = 30;

//local storage
let savedMode = localStorage.getItem("mode");
let ballLocation = localStorage.getItem("location");

if (savedMode === "light") {
    document.body.classList.add("light");
    ball.style.right = ballLocation;
    ball.style.cssText = `transform: translateX(24px);`;
}
//get the data
function getData() {
    category.forEach((button) => {
        button.addEventListener("click", async function () {
            let thecategory = button.className;
            let response = await fetch(`json files/${thecategory}-file.json`);
            let theData = await response.json();
            //shuffle date to get different question every time
            let theShuffle = theData.sort(() => Math.random() - 0.5);
            //select the first 10 questions
            let theQuestions = theShuffle.slice(0, QUESTIONNUMBER);
            choosePage.style.display = "none";
            quizzArea.style.display = "flex";
            setQuizzStyle(thecategory);
            setData(theQuestions, thecategory);
            countdown(TIME, QUESTIONNUMBER);
            submitClick(theQuestions, thecategory);
            selectAnswer(thecategory);
        });
    });
}
getData();

//set quizz page data
function setData(theQuestions, thecategory) {
    if (currentQuestion <= theQuestions.length - 1) {
        const QUESTION = Object.keys(theQuestions[currentQuestion])[0];
        console.log(theQuestions[currentQuestion]["correct"]);
        //set the question
        mainQuestion.innerHTML = theQuestions[currentQuestion][QUESTION];
        //set the asnwers
        for (let i = 1; i <= ANSWERSNUMBER; i++) {
            let answer = document.querySelector(`.answer-${i}`);
            answer.innerHTML = theQuestions[currentQuestion][`answer${i}`];
            document
                .querySelector(`.answer-${i}`)
                .classList.remove(`${thecategory}-check`, "correct", "wrong");
            //set answers style
            answer.classList.add(thecategory);
        }
    }
}
//set quizz page style
function setQuizzStyle(thecategory) {
    submitButton.classList.add(thecategory);
    countBorder.classList.add(thecategory);
    theSilder.classList.add(thecategory);
}

function submitClick(theQuestions, thecategory) {
    submitButton.addEventListener("click", function () {
        if (currentQuestion <= theQuestions.length - 1) {
            //check Answer
            const CORRECT = Object.keys(theQuestions[currentQuestion])[4];
            let theRightAnswer = theQuestions[currentQuestion][CORRECT];
            let paragraphs = document.querySelectorAll(".answers p");
            let selectedElement;
            let theRightElement;
            paragraphs.forEach((p) => {
                if (p.textContent.trim() === selectedAnswer) {
                    selectedElement = p;
                }
            });

            paragraphs.forEach((p) => {
                if (p.textContent.trim() === theRightAnswer) {
                    theRightElement = p;
                }
            });
            if (theRightAnswer === selectedAnswer) {
                theScore++;
                selectedElement.classList.add("correct");
            } else if (!selectedElement) {
                theRightElement.classList.add("correct");
            } else {
                selectedElement.classList.add("wrong");
                if (theRightElement) {
                    theRightElement.classList.add("correct");
                }
            }

            //change the question
            currentQuestion++;
            setTimeout(() => {
                setData(theQuestions, thecategory);
            }, 1000);
            setSlider();
            clearInterval(countdownInterval);
            countdown(TIME, QUESTIONNUMBER);
            if (currentQuestion === QUESTIONNUMBER) {
                setResult();
            }
        }
    });
}

//select the answer
function selectAnswer(thecategory) {
    answers.forEach((answer) => {
        answer.addEventListener("click", function () {
            for (let i = 1; i <= ANSWERSNUMBER; i++) {
                document
                    .querySelector(`.answer-${i}`)
                    .classList.remove(`${thecategory}-check`);
            }
            answer.classList.add(`${thecategory}-check`);
            selectedAnswer = answer.innerHTML;
        });
    });
}

//set slider
function setSlider() {
    let container = document.querySelector(".container");
    let containerWidth = container.getBoundingClientRect().width;
    let silderWidth = container.getBoundingClientRect().width / QUESTIONNUMBER;
    slider += silderWidth;
    theSilder.style.width = `${(slider / containerWidth) * 100}%`;
}

// set Count Down
function countdown(duration, count) {
    if (currentQuestion < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${seconds} : ${minutes}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}

//set result
function setResult() {
    choosePage.style.display = "none";
    quizzArea.style.display = "none";
    resultArea.style.display = "block";
    let winner = document.querySelector(".winner");
    let average = document.querySelector(".average");
    let loser = document.querySelector(".loser");

    if (theScore >= 7 && theScore <= 10) {
        winner.style.display = "block";
        let quetionSpan = document.querySelector(".winner-text .question");
        let answerSpan = document.querySelector(".winner-text .answer");
        quetionSpan.innerHTML = QUESTIONNUMBER;
        answerSpan.innerHTML = theScore;
    } else if (theScore >= 5 && theScore < 7) {
        average.style.display = "block";
        let quetionSpan = document.querySelector(".average-text .question");
        let answerSpan = document.querySelector(".average-text .answer");
        quetionSpan.innerHTML = QUESTIONNUMBER;
        answerSpan.innerHTML = theScore;
    } else {
        loser.style.display = "block";
        let quetionSpan = document.querySelector(".loser-text .question");
        let answerSpan = document.querySelector(".loser-text .answer");
        quetionSpan.innerHTML = QUESTIONNUMBER;
        answerSpan.innerHTML = theScore;
    }
}
// set light mode
let checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
    document.body.classList.toggle("light");
    let mode = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("mode", mode);
    if (mode === "light") {
        ball.style.transform = "translateX(24px)";
        localStorage.setItem("location", "2px");
    } else {
        ball.style.transform = "translateX(0)";
        localStorage.setItem("location", "0");
    }
});
