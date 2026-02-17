const TOTAL_PER_LEVEL = 10;
let level = 1;
let currentIndex = 0;
let levelCountries = [];
let mode = "single";

let player = 1;
let scores = {1:0, 2:0};

let ipcRenderer;
try {
  if (typeof require !== 'undefined') {
    ipcRenderer = require('electron').ipcRenderer;
  }
} catch (e) {
  console.log("Running in Web Mode");
  window.addEventListener('load', () => {
      document.body.style.backgroundImage = "url('https://media.giphy.com/media/xT9IgN8YKRhByRBzkA/giphy.gif')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
  });
  document.addEventListener("DOMContentLoaded", () => {
      const controls = document.querySelector('.window-controls');
      if(controls) controls.style.display = 'none';
  });
}

function startGame(selectedMode){
  mode = selectedMode;
  const music = document.getElementById("bgMusic");
  music.volume = 0.3;
  music.play().catch(e => console.log("Audio waiting for interaction"));
  document.getElementById("welcome").classList.add("hidden");
  showMenu();
}

function goHome(){
  location.reload();
}

function showMenu(){
  document.body.classList.remove("popup-active");
  document.getElementById("popup").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
  renderLevels();
}

function renderLevels(){
  const levelList = document.getElementById("levelList");
  levelList.innerHTML="";
  const max = Math.ceil(countries.length/TOTAL_PER_LEVEL);
  for(let i=1;i<=max;i++){
    const btn=document.createElement("button");
    btn.innerText="Lvl "+i;
    btn.onclick=()=>startLevel(i);
    levelList.appendChild(btn);
  }
}

function startLevel(lvl){
  level=lvl;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("popup").classList.add("hidden"); 
  levelCountries=countries.slice((lvl-1)*TOTAL_PER_LEVEL,lvl*TOTAL_PER_LEVEL);
  currentIndex=0;
  scores = {1:0, 2:0};
  player = 1;
  loadQuestion();
}

function startBossLevel(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("popup").classList.add("hidden");
  levelCountries=[...countries].sort(()=>0.5-Math.random()).slice(0,20);
  currentIndex=0;
  scores = {1:0, 2:0};
  player = 1;
  loadQuestion();
}

function loadQuestion(){
  if(currentIndex>=levelCountries.length){
    finishGame();
    return;
  }
  const flagImg = document.getElementById("flag");
  flagImg.classList.add("hidden");
  flagImg.src = ""; 
  const scrambledEl = document.getElementById("scrambled");
  scrambledEl.style.color = "#555"; 
  const country=levelCountries[currentIndex];
  scrambledEl.innerText = shuffle(country.name);
  document.getElementById("progress").innerText= (currentIndex+1)+" / "+levelCountries.length;
  updateBar();
  const playerTurnEl = document.getElementById("playerTurn");
  if(mode==="multi"){
    playerTurnEl.classList.remove("hidden");
    playerTurnEl.innerText = "Player "+player+"'s Turn";
  } else {
    playerTurnEl.classList.add("hidden");
  }
  const input = document.getElementById("answer");
  input.value = "";
  input.disabled = false;
  document.getElementById("submitBtn").disabled = false;
  input.focus();
}

function checkAnswer(){
  const inputEl = document.getElementById("answer");
  const inputVal = inputEl.value.trim().toLowerCase();
  const country = levelCountries[currentIndex];
  const scrambledEl = document.getElementById("scrambled");
  const flagImg = document.getElementById("flag");

  inputEl.disabled = true;
  document.getElementById("submitBtn").disabled = true;

  flagImg.src = `https://flagcdn.com/w320/${country.code}.png`;
  flagImg.classList.remove("hidden");
  scrambledEl.innerText = country.name; 

  if(inputVal === country.name.toLowerCase()){
    document.getElementById("correctSound").play();
    scrambledEl.style.color = "var(--correct-text)"; 
    if(mode==="multi") scores[player]++;
  } else {
    document.getElementById("wrongSound").play();
    scrambledEl.style.color = "var(--wrong-text)"; 
  }

  if(mode==="multi"){
      player = player === 1 ? 2 : 1;
  }

  currentIndex++;
  setTimeout(loadQuestion, 2000);
}

function backToMenu() {
  document.getElementById("game").classList.add("hidden");
  showMenu();
}

function toggleMusic() {
  const music = document.getElementById("bgMusic");
  if (music.paused) music.play();
  else music.pause();
}

function finishGame(){
  showPopup();
  launchFireworks();
}

function showPopup(){
  const popup=document.getElementById("popup");
  popup.classList.remove("hidden");
  document.body.classList.add("popup-active");
  if(mode==="multi"){
    let winnerText = "";
    if(scores[1] > scores[2]) {
        winnerText = "Player 1 Wins!";
        document.getElementById("medal").innerText="👑";
    }
    else if(scores[2] > scores[1]) {
        winnerText = "Player 2 Wins!";
        document.getElementById("medal").innerText="👑";
    }
    else {
        winnerText = "It's a Tie!";
        document.getElementById("medal").innerText="🤝";
    }
    document.getElementById("popupTitle").innerText="Game Over!";
    document.getElementById("popupText").innerText=winnerText + ` (${scores[1]} vs ${scores[2]})`;
  }else{
    document.getElementById("popupTitle").innerText="Level Complete!";
    document.getElementById("popupText").innerText="Legend Status Achieved";
    document.getElementById("medal").innerText="🥇";
  }
}

function nextLevel(){
  document.body.classList.remove("popup-active");
  document.getElementById("popup").classList.add("hidden");
  if(mode === "single" && level < Math.ceil(countries.length/TOTAL_PER_LEVEL)){
      startLevel(level + 1);
  } else {
      showMenu();
  }
}

function updateBar(){
  const percent=(currentIndex/levelCountries.length)*100;
  document.getElementById("progress-fill").style.width=percent+"%";
}

function shuffle(word){
  let shuffled = word.split("").sort(()=>0.5-Math.random()).join("");
  while(shuffled === word && word.length > 1) {
     shuffled = word.split("").sort(()=>0.5-Math.random()).join("");
  }
  return shuffled;
}

function launchFireworks(){
  const container=document.getElementById("fireworks");
  for(let i=0;i<40;i++){
    const div=document.createElement("div");
    div.style.left="50%";
    div.style.top="50%";
    const x=(Math.random()*400-200)+"px";
    const y=(Math.random()*400-200)+"px";
    div.style.setProperty("--x",x);
    div.style.setProperty("--y",y);
    container.appendChild(div);
    setTimeout(()=>div.remove(),1000);
  }
}

function resetProgress(){
  localStorage.clear();
  location.reload();
}

if (ipcRenderer) {
  document.getElementById('closeBtn').addEventListener('click', () => {
    ipcRenderer.send('close-app');
  });
  document.getElementById('minBtn').addEventListener('click', () => {
    ipcRenderer.send('minimize-app');
  });
}