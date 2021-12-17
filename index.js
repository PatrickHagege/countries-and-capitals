
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

// answers = tableau des pays réponses (objets country)
// questions contiendra 10 sets de 4 pays (3 dans un premier temps)
// sets représente un jeu de questions
function extractQuestionsSets(shuffledCountries) {
    // nbr de pays par jeu de questions => 3 puis 4
    let countQuestionsPerSet = 0;
    // ndr de sets => 10
    let countNumberOfSets = 0;
    // nombre total de pays à extraire de shuffledCountries
    let counter = 0;
    while (countNumberOfSets < 10) {
        // tant que le nombre de questions par set de questions (3) n'est pas atteint
        while (countQuestionsPerSet < 3) {
            // on push dans un set l'elément situé à l'index courant du tableau shuffledCountries
            set.push(shuffledCountries[counter]); // 0 puis 1 puis 2
            // on supprime l'élément courant de shuffledCountries
            shuffledCountries.splice(counter, 1);
            // on incrémente l'index de l'élément courant dans le set courant
            countQuestionsPerSet++;
            // on incrémente le compteur qui parcourt shuffledCountries
            counter++;
        }
        // ou spread les valeurs comprises dans set
        questions[countNumberOfSets] = [...set];
        // on reinitialise set
        set = [];
        countNumberOfSets++;
        // reinitialisation nu nb de questions par set pour relancer un nouveau set
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
                    currentSetContainer.innerHTML = `<span class="red">${currentSet}</span>/10`;
                    let body = document.querySelector("body");
                    let finalScreen = document.createElement("div");
                    let resultSpan = document.createElement("span")
                    let finalMessage = document.createTextNode(`your score for this game is : <span class="red">${score}</span>`);
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