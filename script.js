document.addEventListener("DOMContentLoaded", ()=>{

const PASSWORD = "Hacker"; // Şifre

// Şifre kontrolü
let pass = prompt("Oyuna başlamak için şifreyi gir:");
if(pass !== PASSWORD){
  alert("Şifre yanlış! Oyuna başlayamazsınız.");
  throw new Error("Şifre hatalı");
}

// Şifre doğruysa Google alert tarzı uyarı
alert("CyberHack RPG Emre Çavuş tarafından üretilmiştir ve tamamen hayal ürünüdür.");

// HTML elementleri
const accept = document.getElementById("accept");
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gamePanel = document.getElementById("gamePanel");
const output = document.getElementById("output");
const input = document.getElementById("command");
const sendBtn = document.getElementById("send");
const missionText = document.getElementById("missionText");
const dayText = document.getElementById("dayText");
const helpBtn = document.getElementById("helpBtn");
const dayOver = document.getElementById("dayOver");
const music = document.getElementById("music");
const alarm = document.getElementById("alarm");
const overlay = document.getElementById("overlay");
const caughtScreen = document.getElementById("caughtScreen");

let wrong = 0;
let day = 1;
let difficulty = 1;
let currentMission = null;

// 50 görev listesi
const missions = [
"steal company_data", "copy rival_logs","download darknet_keys","pull bank_credentials","scan server_logs","inject secret_contracts",
"steal admin_tokens","copy root_keys","download server_logs","pull secret_contracts","scan company_data","inject rival_logs",
"steal root_keys","copy bank_credentials","download admin_tokens","pull darknet_keys","scan secret_contracts","inject company_data",
"steal server_logs","copy secret_contracts","download rival_logs","pull company_data","scan admin_tokens","inject bank_credentials",
"steal darknet_keys","copy server_logs","download company_data","pull admin_tokens","scan root_keys","inject rival_logs",
"steal secret_contracts","copy admin_tokens","download server_logs","pull root_keys","scan bank_credentials","inject darknet_keys",
"steal rival_logs","copy company_data","download bank_credentials","pull secret_contracts","scan darknet_keys","inject server_logs",
"steal admin_tokens","copy root_keys","download secret_contracts","pull server_logs","scan company_data","inject bank_credentials",
"steal bank_credentials","copy darknet_keys","download admin_tokens","pull rival_logs","scan root_keys","inject company_data"
];

accept.addEventListener("change",()=> startBtn.disabled = !accept.checked);

startBtn.addEventListener("click", ()=>{
  startScreen.style.display = "none";
  gamePanel.style.display = "flex";
  input.disabled = false;
  input.readOnly = false;
  input.focus();
  forceFocus();
  music.play();
  nextMission();
  startDayTimer();
});

// Kesin focus fonksiyonu
function forceFocus(){
  input.focus();
  setTimeout(forceFocus,50);
}

// Görev seçimi
function nextMission(){
  const index = Math.floor(Math.random()*missions.length);
  currentMission = { code: missions[index] };
  missionText.textContent = "Görev: " + currentMission.code.replace("_"," ");
}

// Yazdırma
function print(txt){
  const d=document.createElement("div");
  d.textContent=txt;
  output.appendChild(d);
  output.scrollTop = output.scrollHeight;
}

// Gönder
sendBtn.onclick = run;
input.addEventListener("keydown", e => { if(e.key==="Enter") run(); });

function run(){
  const cmd = input.value.trim().toLowerCase();
  if(!cmd) return;
  print("> " + cmd);

  if(cmd === currentMission.code){
    print("✔ Başarılı!");
    wrong = 0;
    nextMission();
  } else {
    wrong++;
    print("❌ Yanlış (" + wrong + "/4)");
    if(wrong >= 4) caught();
  }
  input.value = "";
}

// Yardım
helpBtn.onclick = ()=>{
  alert(`İPUCU:\nKod: ${currentMission.code}\nFake IP: 192.168.${rand()}.${rand()}`);
};

// Yakalanma
function caught(){
  music.pause();
  alarm.play();
  overlay.style.opacity = 1;
  caughtScreen.style.display = "flex";
}

// Gün sistemi
function startDayTimer(){
  setInterval(()=>{
    dayOver.style.display="block";
    overlay.style.opacity = 0.7;

    setTimeout(()=>{
      dayOver.style.display="none";
      overlay.style.opacity = 0;
      day++;
      dayText.textContent = "Gün " + day;
    },2000);

  },300000); // 5dk = 1 gün
}

// Fake IP helper
function rand(){ return Math.floor(Math.random()*255); }

});