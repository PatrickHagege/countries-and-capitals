
import { countries } from "./all.js";

let capitalContainer = document.getElementById("capital-to-guess");
let scoreContainer = document.getElementById("earned-points");
let currentSetContainer = document.getElementById("current-set");
let choice1Btn = document.getElementById("choice-1");
let choice2Btn = document.getElementById("choice-2");
let choice3Btn = document.getElementById("choice-3");
let choice4Btn = document.getElementById("choice-4");

let shuffledCountries = [];
let answers = [];
let questions = [];
let set = [];
let score = 0;
let currentSet = 0;

let filteredCountries = countries.filter((country) => {
    if (country.capital) {
        return country;
    }
});

console.log(filteredCountries);
function shuffleCountries(countries) {
    if (!countries) return undefined;
    console.log(countries);
    let buffer = [...countries];
    countries = [];
    let currentIndex = buffer.length;
    let randomIndex = 0;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        countries.push(buffer[randomIndex]);
        buffer.splice(randomIndex, 1);
        //console.log("apres le splice buffer contient :", buffer);
        //console.log("apres le splice countries contient :", countries);
        currentIndex--;
    }
    return countries;
}

shuffledCountries = shuffleCountries(filteredCountries);
// console.log(shuffledCountries[0]);

function extractAnswers(shuffledCountries) {
    for (let i = 0; i < 10; i++) {
        answers.push(shuffledCountries[i]);
    }
    for (let i = 0; i < 10; i++) {
        shuffledCountries.shift();
    }
}

// answers => array of answers extracted from the countries object imported
// questions => 10 sets of 4 pays (3 in a first time)
// sets => a set of 4 questions
function extractQuestionsSets(shuffledCountries) {
    // initialisation of the number of question per set
    let countQuestionsPerSet = 0;
    // number of sets => 10
    let countNumberOfSets = 0;
    // will walk through the countries to extract the questions sets
    let counter = 0;
    while (countNumberOfSets < 10) {
        // while the number of questions by set of questions (3) is not hit
        while (countQuestionsPerSet < 3) {
            // push in a set the element at current index of shuffledCountries array
            set.push(shuffledCountries[counter]); // 0 and  1 and three
            // delete the inserted current element
            shuffledCountries.splice(counter, 1);
            // increment the current element in the current set
            countQuestionsPerSet++;
            // increment the counter which walk through shuffledCountries aray
            counter++;
        }
        // spread value in a set
        questions[countNumberOfSets] = [...set];
        // reinitialise set
        set = [];
        countNumberOfSets++;
        // reinitialisation of the nb of questions per set to generate a new set
        countQuestionsPerSet = 0;
    }
}

function pushAnswersInQuestions(answers, questions) {
    for (let i = 0; i < answers.length; i++) {
        questions[i].push(answers[i])
    }
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function shuffleQuestions(questions) {
    //console.log("QUESTIONS IN SHUFFLE QUESTIONS :", questions);
    for (let index = 0; index < questions.length; index++) {
        let question = questions[index];
        shuffle(question);
    }
}

//console.log("avant shuffleQuestion answers vaut: ", answers);
//console.log("avant shuffleQuestion questions vaut: ", questions);
function generateQuestionScreen(answers, questions) {
    shuffleQuestions(questions);
    //console.log("apres shuffleQuestion questions vaut: ", questions)

    scoreContainer.innerHTML = `score: ${score}`;
    currentSetContainer.innerHTML = `question: ${currentSet}/10`;
    capitalContainer.textContent = answers[currentSet].capital;
    choice1Btn.textContent = questions[currentSet][0].name.common;
    choice2Btn.textContent = questions[currentSet][1].name.common;
    choice3Btn.textContent = questions[currentSet][2].name.common;
    choice4Btn.textContent = questions[currentSet][3].name.common;
    choice1Btn.style.backgroundColor = "rgb(53,107,171)";
    choice2Btn.style.backgroundColor = "rgb(53,107,171)";
    choice3Btn.style.backgroundColor = "rgb(53,107,171)";
    choice4Btn.style.backgroundColor = "rgb(53,107,171)";
}

function reload() {
    location.reload();
}

function validateAnswer() {
    let choicePropositions = document.querySelectorAll("#propositions button");
    //console.log(choicePropositions);

    for (var i = 0; i < choicePropositions.length; i++) {
        let self = choicePropositions[i];
        let capitalContainer = document.getElementById("capital-to-guess");
        self.addEventListener('click', (event) => {
            // prevent browser's default action
            event.preventDefault();
            let clickedCountry = questions[currentSet].find((country) => event.target.textContent === country.name.common);
            console.log(clickedCountry.capital[0]);
            console.log(capitalContainer.textContent);
            if (clickedCountry.capital[0] === capitalContainer.textContent) {
                console.log("right !");
                score += 10;
                event.target.style.backgroundColor = "green";
            } else {
                console.log("wrong !");
                event.target.style.backgroundColor = "red";
            }
            if (currentSet === 9) {
                console.log("jeu terminé !");
                // populateStorage();
            }
            currentSet++;
            setTimeout(() => {
                if (currentSet < 10) {
                    console.log(currentSet);
                    generateQuestionScreen(answers, questions);
                } else {
                    currentSetContainer.innerHTML = `${currentSet}/10`;
                    let body = document.querySelector("body");
                    let finalScreen = document.createElement("div");
                    let resultSpan = document.createElement("span")
                    let finalMessage = document.createTextNode(`your score for this game is : ${score}`);
                    let replayBtn = document.createElement("button");
                    finalScreen.setAttribute("id", "final-screen");
                    replayBtn.setAttribute("id", "replay-btn");
                    replayBtn.textContent = "REPLAY !";
                    replayBtn.addEventListener("click", reload);
                    resultSpan.appendChild(finalMessage);
                    finalScreen.appendChild(resultSpan);
                    finalScreen.appendChild(replayBtn);
                    body.appendChild(finalScreen);
                }
            }, 300);
            // event.target.style.backgroundColor="rgb(71, 159, 253)";
        }, false);
    }
}
//console.log(storedScore);
//console.log(storedDate);

window.addEventListener('load', (event) => {
    console.log("answers", answers, "questions", questions);
    generateQuestionScreen(answers, questions);

});

//console.log(shuffledCountries.__proto__);

extractAnswers(shuffledCountries);
extractQuestionsSets(shuffledCountries);
pushAnswersInQuestions(answers, questions);
validateAnswer();