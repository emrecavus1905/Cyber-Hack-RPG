let autoHack = 0;
let extraChance = 0;
let shield = 0;
let doubleScore = false;
alert("CyberHack RPG Emre Çavuş tarafından yapılmış olup tamamen hayal ürünüdür.");

const screens = {
  start: document.getElementById("startScreen"),
  register: document.getElementById("registerScreen"),
  game: document.getElementById("gamePanel"),
  caught: document.getElementById("caughtScreen")
};

const accept = document.getElementById("accept");
const acceptBtn = document.getElementById("acceptBtn");
const registerBtn = document.getElementById("registerBtn");

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");

const missionText = document.getElementById("missionText");
const dayText = document.getElementById("dayText");
const scoreText = document.getElementById("scoreText");

const output = document.getElementById("output");
const input = document.getElementById("command");
const send = document.getElementById("send");
const helpBtn = document.getElementById("helpBtn");

const music = document.getElementById("music");
const alarm = document.getElementById("alarm");

const onlineBox = document.getElementById("onlineScores");

let day=1, score=0, wrong=0, mission=null;

accept.onchange = ()=> acceptBtn.disabled=!accept.checked;

acceptBtn.onclick = ()=>{
  screens.start.classList.add("hidden");
  screens.register.classList.remove("hidden");
};

registerBtn.onclick = ()=>{
  localStorage.setItem("user",JSON.stringify({email:emailInput.value,pass:passInput.value}));
  screens.register.classList.add("hidden");
  screens.game.classList.remove("hidden");
  music.play();
  nextMission();
  input.focus();
};

const missions = [
 {text:"Rakip firmanın loglarını kopyala", steps:["connect server","copy logs"]},
 {text:"Kara ağdan şifreleri çek", steps:["connect darknet","fetch passwords"]},
 {text:"Sunucudan müşteri datası al", steps:["bypass firewall","download clients"]}
];

let stepIndex=0;

function nextMission(){
 mission = missions[Math.floor(Math.random()*missions.length)];
 stepIndex=0;
 missionText.textContent = "Görev: "+mission.text+" ("+(stepIndex+1)+"/"+mission.steps.length+")";
}

function print(t){
 output.innerHTML+=t+"<br>";
 output.scrollTop=output.scrollHeight;
}

send.onclick = run;
input.addEventListener("keydown",e=>e.key==="Enter"&&run());

function run(){
  const cmd = input.value.trim();
  print("> "+cmd);

  if(cmd === mission.steps[stepIndex] || autoHack>0){
    if(autoHack>0){
      print("🤖 AutoHack kullanıldı, adım otomatik tamamlandı!");
      autoHack--;
    }

    stepIndex++;

    if(stepIndex>=mission.steps.length){
      let reward = doubleScore ? 200 : 100;
      print("✔ Görev tamamlandı! +" + reward);
      score += reward;
      doubleScore = false;
      updateUI(); uploadScore();
      wrong=0; nextMission();
    } else {
      missionText.textContent = "Görev: "+mission.text+" ("+(stepIndex+1)+"/"+mission.steps.length+")";
      print("→ Adım tamamlandı");
    }
  } else {
    if(extraChance>0){
      extraChance--;
      print("➕ Extra hak kullanıldı!");
    } else if(shield>0){
      shield--;
      print("🛡 Shield hasarı engelledi!");
    } else {
      wrong++;
      print("✖ Hatalı komut");
      if(wrong>=4){
        alarm.play();
        screens.game.classList.add("hidden");
        screens.caught.classList.remove("hidden");
      }
    }
  }

  input.value="";
  input.focus();
}
function updateUI(){
 scoreText.textContent="Skor: "+score;
}

helpBtn.onclick = ()=> alert("İpucu: "+mission.steps[stepIndex]);

setInterval(()=>{day++;dayText.textContent="Gün "+day;},300000);

// Online skor (local simülasyon)
function uploadScore(){
 const u = JSON.parse(localStorage.getItem("user"));
 let list = JSON.parse(localStorage.getItem("onlineScores")||"[]");
 list.push({email:u.email,score});
 localStorage.setItem("onlineScores",JSON.stringify(list));
}

document.getElementById("onlineBtn").onclick = ()=>{
 onlineBox.classList.toggle("hidden");
 const list = JSON.parse(localStorage.getItem("onlineScores")||"[]");
 onlineBox.innerHTML="<b>Online Skor</b><br>"+list.map(x=>x.email+": "+x.score).join("<br>");
};

document.getElementById("saveBtn").onclick = ()=>{
 localStorage.setItem("save",JSON.stringify({day,score}));
 print("💾 Oyun kaydedildi");
};

document.getElementById("loadBtn").onclick = ()=>{
 const s = JSON.parse(localStorage.getItem("save"));
 if(s){day=s.day;score=s.score;dayText.textContent="Gün "+day;updateUI();print("📂 Yüklendi");}
};

// Matrix arka plan
const canvas=document.getElementById("matrix"),ctx=canvas.getContext("2d");
canvas.width=innerWidth; canvas.height=innerHeight;
const letters="01HACKNODE$#",font=14,cols=canvas.width/font,drops=Array(Math.floor(cols)).fill(1);

setInterval(()=>{
 ctx.fillStyle="rgba(0,0,0,.1)";
 ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="#00ff66"; ctx.font=font+"px monospace";
 for(let i=0;i<drops.length;i++){
  const t=letters[Math.floor(Math.random()*letters.length)];
  ctx.fillText(t,i*font,drops[i]*font);
  if(drops[i]*font>canvas.height && Math.random()>0.97)drops[i]=0;
  drops[i]++;
 }
},33);

// Panel matrix
const p=document.getElementById("panelMatrix"),pctx=p.getContext("2d");
p.width=600; p.height=400;
const pDrops=Array(Math.floor(p.width/font)).fill(1);

setInterval(()=>{
 pctx.fillStyle="rgba(0,0,0,.2)";
 pctx.fillRect(0,0,p.width,p.height);
 pctx.fillStyle="#00ff66"; pctx.font=font+"px monospace";
 for(let i=0;i<pDrops.length;i++){
  const t=letters[Math.floor(Math.random()*letters.length)];
  pctx.fillText(t,i*font,pDrops[i]*font);
  if(pDrops[i]*font>p.height && Math.random()>0.97)pDrops[i]=0;
  pDrops[i]++;
 }
},50);const shopPanel = document.getElementById("shopPanel");

function openShop(){
  shopPanel.classList.remove("hidden");
}

function closeShop(){
  shopPanel.classList.add("hidden");
}

function sellData(){
  score += 100;
  updateUI();
  print("💰 Veriler DeepShop'ta satıldı (+100)");
}

function buyTool(type){
  if(score < 150){
    print("❌ Yetersiz skor");
    return;
  }
  score -= 150;
  updateUI();
  print("🧰 "+type+" tool satın alındı!");
}
function buyItem(type){
  const prices = {autohack:300, chance:200, shield:250, double:400};
  if(score < prices[type]){
    print("❌ Yetersiz skor");
    return;
  }
  score -= prices[type];
  updateUI();

  if(type==="autohack") autoHack++;
  if(type==="chance") extraChance++;
  if(type==="shield") shield++;
  if(type==="double") doubleScore = true;

  print("🧰 Satın alındı: "+type);
}
