// import {countries as foo} from "./all.js"

// console.log("data");
// console.log(foo);

////////// ESSAI RECUP DONNEES JSON /////////////////

// const ul = document.createElement("ul");
// const countries = fetch("./all.json")
// .then(response => {
//    return response.json();
// })
// .then(function (countries){
//     countries.forEach(function(country){
//         const li = document.createElement("li");
//         //li.textContent = JSON.stringify(country.capital,'<br>');
//         if (country.capital) {
//             li.innerHTML = `<img src=${country.flags.svg} alt=""> ${country.translations.fra.common}, sa capitale est ${country.capital}, sa population est de ${country.population} habitants, `;
//             ul.appendChild(li);
//         }
//     });
// });
// document.body.appendChild(ul);




////////////////  ESSAI RECUP DONNEES JSON  ///////////////////
import { countries } from "./all.js";

let shuffledCountries = [];
let answers = [];
let questions = [];
let set = [];
let score = 0;
let currentSet = 0;

////               FROM GUILLAUME FETCH QUI MARCHE  !!!           //       

// let chose = [];

// function fetchData() {
//     return new Promise((resolve, reject) => {
//         const ul = document.createElement("ul");
//         fetch("./all.json").then(response => {
//             resolve(response.json());
//         })
//     })
// }

// async function init() {
//     try {
//         chose = await fetchData();
//         //console.log("chose", chose);
//     } catch (err) {
//         console.error(err);
//     }
// }

// init();
// console.log("chose :", chose);

// function displayCountries(list) {
//     list.forEach(function (country) {
//         const li = document.createElement("li");
//         //li.textContent = JSON.stringify(country.capital,'<br>');
//         if (country.capital) {
//             li.innerHTML = `<img src=${country.flags.svg} alt=""> ${country.translations.fra.common}, sa capitale est ${country.capital}, sa population est de ${country.population} habitants, `;
//             ul.appendChild(li);
//         }
//     });
// }

let filteredCountries = countries.filter((country)  => {
    if(country.capital) {
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


// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// function shuffle(array) {
//     let currentIndex = array.length,  randomIndex;
  
//     // While there remain elements to shuffle...
//     while (currentIndex != 0) {
  
//       // Pick a remaining element...
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;
  
//       // And swap it with the current element.
//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex], array[currentIndex]];
//     }

//     return array;
//   }

function shuffleQuestions(questions) {
    console.log("QUESTIONS IN SHUFFLE QUESTIONS :", questions);
    for (let index = 0; index < questions.length; index++) {
        let question = questions[index];
        shuffle(question);
    }
}

function testAnswerData(answers) {
    const ul = document.createElement("ul");
    const answer = answers[0];
    const li = document.createElement("li");
    //li.textContent = JSON.stringify(country.capital,'<br>');
    if (answer.capital) {
        li.innerHTML = `<img src=${answer.flags.svg} alt=""> ${answer.translations.fra.common}, sa capitale est ${answer.capital}, sa population est de ${answer.population} habitants.`;
        ul.appendChild(li);
    }
    document.body.appendChild(ul);

}

function generateQuestionScreen(answers, questions) {
    shuffleQuestions(questions);
    let capitalContainer = document.getElementById("capital-to-guess");
    let scoreContainer = document.getElementById("earned-points");
    let currentSetContainer = document.getElementById("current-set");
    let choice1Btn = document.getElementById("choice-1");
    let choice2Btn = document.getElementById("choice-2");
    let choice3Btn = document.getElementById("choice-3");
    let choice4Btn = document.getElementById("choice-4");

    scoreContainer.textContent = `score: ${score}`;
    currentSetContainer.textContent = `question: ${currentSet}/10`;
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


function validateAnswer() {
    let choicePropositions = document.querySelectorAll("#propositions button");
    //console.log(choicePropositions);
    
    for (var i = 0; i < choicePropositions.length; i++) {
        let self = choicePropositions[i];
        let capitalContainer = document.getElementById("capital-to-guess");
        self.addEventListener('click',  (event) => {
            // prevent browser's default action
            event.preventDefault();
            let clickedCoutry = questions[currentSet].find((country) => event.target.textContent === country.name.common);
            console.log(clickedCoutry.capital[0]);
            console.log(capitalContainer.textContent);
            if(clickedCoutry.capital[0] === capitalContainer.textContent) {
                console.log("right !");
                score+=10;
                event.target.style.backgroundColor="green";
            }   else    {
                console.log("wrong !");
                event.target.style.backgroundColor="red";
            }
            if (currentSet === 9) {
                console.log("jeu terminé !");
            }
            currentSet++;
            setTimeout(() => {
                generateQuestionScreen(answers, questions);
            }, 300);
            // event.target.style.backgroundColor="rgb(71, 159, 253)";
        }, false);
    }
}

window.addEventListener('load', (event) => {
    console.log("answers", answers, "questions", questions);
    generateQuestionScreen(answers, questions);

});


//console.log(shuffledCountries.__proto__);

extractAnswers(shuffledCountries);
extractQuestionsSets(shuffledCountries);
pushAnswersInQuestions(answers, questions);
validateAnswer();

//console.log("answers :", answers);
//console.log("questions :", questions);
//testAnswerData(answers);
// console.log(answers);