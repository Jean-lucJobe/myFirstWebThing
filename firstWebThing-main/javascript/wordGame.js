const HTMLWord = document.querySelector("#guess_word");
const HTMLLives = document.querySelector("#lives");
const newWordBTN = document.querySelector("#restart");
const startBTN = document.querySelector("#start");
const keyboard = document.querySelector("#keyboard");
const guessContainers = HTMLWord.getElementsByClassName("guess-container");

var gameOn = false;

const player = {
  lives: 0
};

const guessWord = {
  word: "",
  characters: [],
  hiddenChars: 0  
};

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function makeWord(worddoc){
  guessWord.word = worddoc[Math.floor(getRandomNumber(0, (worddoc.length)))];
  guessWord.hiddenChars = guessWord.word.length;
  guessWord.characters = wordsplitting(guessWord.word);
  generateHTML(guessWord.word.length);
}

function getWord(){
  return fetch("../firstWebThing/wordz.json")
  .then(response => response.json())
  .then(data => makeWord(data));
}

// function to help assign a value to guessWord.characters
function wordsplitting (word){
  let res = [];
  for(let i=0;i<word.length;i++){
    res.push([word.slice(i,i+1),"hidden"]);
  }
  return res;
}

function generateHTML(word){
  for(let i=0;i<guessWord.word.length;i++){
    const guessContainer = document.createElement("div");
    const underscore = document.createElement("span");
    guessContainer.className = "guess-container";
    underscore.className = "underscore";
    guessContainer.appendChild(underscore);
    HTMLWord.appendChild(guessContainer);
  }
}

// game setup
function gameInit(){
  HTMLWord.innerHTML = "";
  player.lives = 3; // need to add html display for lives
  setLifeDisplay("losslife", "none");
  setLifeDisplay("life", "block");
  getWord();
  gameOn = true;
}

function setLifeDisplay(hearts, look){
  const lives = HTMLLives.getElementsByClassName(hearts);
  for(let i=0;i<lives.length;i++){
    lives[i].style.display = look;
  }
}

function loseLife(){
  const lives = HTMLLives.getElementsByClassName("life");
  const nolives = HTMLLives.getElementsByClassName("losslife");
  lives[player.lives].style.display = "none";
  nolives[player.lives].style.display = "block";
}

// part of keyboard functionality
function isHit(val){
  let hit = false;
  for(let i=0;i<guessWord.characters.length;i++){
    if(guessWord.characters[i][0] === val){
      hit = true;
      if(guessWord.characters[i][1] === "hidden"){
        const guesschar = document.createElement("div");
        guesschar.className = "guesschar";
        guesschar.textContent = val;
        guessContainers[i].firstElementChild.before(guesschar);
        guessWord.hiddenChars--;
      }
    }
  }
  return hit;
}

// needs finishing!
keyboard.addEventListener('click', (event) => {
  if(gameOn === true){
    const keyval = event.target.textContent;
    let hit = isHit(keyval);
    if(hit === false) {
      player.lives--;
      loseLife();
      if(player.lives < 1){ 
        //lose game; needs HTML display
        gameOn = false;
        console.log("you lose.");
      }
    }
    if(hit === true && guessWord.hiddenChars < 1){
      //win game; needs HTML display
      gameOn = false;
      console.log("you win.");
    }
  }
});

startBTN.addEventListener('click', (event) => {
  startBTN.remove();
  gameInit();
  newWordBTN.style.display = "flex";
});
newWordBTN.addEventListener('click', (event) => gameInit());
