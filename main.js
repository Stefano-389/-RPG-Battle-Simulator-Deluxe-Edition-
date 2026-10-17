// 1. DATASET ESTESO DEL GIOCO (DELUXE)

const armiEroe = {
  spada:            { nome: "Spada", dannoMin: 15, dannoMax: 25, tipoDanno: "taglio" },
  mazza:            { nome: "Mazza", dannoMin: 18, dannoMax: 22, tipoDanno: "impatto" },
  arco:             { nome: "Arco",  dannoMin: 12, dannoMax: 28, tipoDanno: "perforazione" },
  bastone_magico:   { nome: "Bastone Magico", dannoMin: 20, dannoMax: 26, tipoDanno: "impatto" },
  pugnali:          { nome: "Pugnali Gemelli", dannoMin: 10, dannoMax: 30, tipoDanno: "perforazione" },
  lanciatore:       { nome: "Lanciatore Pesante", dannoMin: 16, dannoMax: 24, tipoDanno: "perforazione" },
  ascia_bipenne:    { nome: "Ascia 2 Mani", dannoMin: 22, dannoMax: 32, tipoDanno: "taglio" }, // Modificato nome visualizzato
  falce_oscura:     { nome: "Falce Oscura", dannoMin: 14, dannoMax: 28, tipoDanno: "taglio" }
};

const personaggiEroe = {
  guerriero:  { nome: "Guerriero", puntiVita: 120, maxVita: 120, avatar: "⚔️" },
  arciere:    { nome: "Arciere", puntiVita: 90, maxVita: 90, avatar: "🏹" },
  paladino:   { nome: "Paladino", puntiVita: 140, maxVita: 140, avatar: "🛡️" },
  mago:       { nome: "Mago", puntiVita: 85, maxVita: 85, avatar: "🧙‍♂️" },
  ladro:      { nome: "Ladro", puntiVita: 95, maxVita: 95, avatar: "🥷" },
  chierico:   { nome: "Chierico", puntiVita: 110, maxVita: 110, avatar: "☀️" },
  berserker:  { nome: "Berserker", puntiVita: 130, maxVita: 130, avatar: "🪓" },
  necromante: { nome: "Necromante", puntiVita: 100, maxVita: 100, avatar: "💀" }
};

const nemici = {
  orco:      { nome: "Orco", puntiVita: 100, maxVita: 100, dannoBase: 12, armatura: "leggera", vulnerabilita: "taglio", resistenza: "perforazione", avatar: "👹" },
  cavaliere: { nome: "Cavaliere", puntiVita: 130, maxVita: 130, dannoBase: 15, armatura: "pesante", vulnerabilita: "impatto", resistenza: "taglio", avatar: "♞" },
  drago:     { nome: "Drago Reale", puntiVita: 180, maxVita: 180, dannoBase: 22, armatura: "scaglie", vulnerabilita: "perforazione", resistenza: "taglio", avatar: "🐉" },
  goblin:    { nome: "Goblin Scaltro", puntiVita: 70, maxVita: 70, dannoBase: 8, armatura: "nessuna", vulnerabilita: "taglio", resistenza: "impatto", avatar: "👺" },
  spettro:   { nome: "Spettro Urlante", puntiVita: 90, maxVita: 90, dannoBase: 14, armatura: "eterea", vulnerabilita: "impatto", resistenza: "perforazione", avatar: "👻" },
  golem:     { nome: "Golem di Roccia", puntiVita: 200, maxVita: 200, dannoBase: 18, armatura: "roccia", vulnerabilita: "impatto", resistenza: "taglio", avatar: "🗿" },
  vampiro:   { nome: "Conte Vampiro", puntiVita: 120, maxVita: 120, dannoBase: 16, armatura: "elegante", vulnerabilita: "perforazione", resistenza: "impatto", avatar: "🦇" }
};

// 2. STATO DEL GIOCO E RIFERIMENTI DOM

let eroe = null;
let villain = null;
let turno = 1;

const logDiv = document.getElementById('log');
const btnAttack = document.getElementById('btn-attack');
const btnRestart = document.getElementById('btn-restart');

// Nuovi riferimenti per la gestione del banner di vittoria
const victoryScreen = document.getElementById('victory-screen');
const victoryMessage = document.getElementById('victory-message');

// 3. FUNZIONI HELPER E GRAFICA

function calcolaDannoBase(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function aggiungiLog(testo, tipo) {
  const p = document.createElement('p');
  p.className = `log-entry ${tipo}`;
  p.innerHTML = testo;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight; 
}

function aggiornaGrafica() {
  document.getElementById('hero-avatar').innerText = eroe.avatar;
  document.getElementById('hero-name').innerText = eroe.nome;
  document.getElementById('hero-weapon').innerText = `🗡️ ${eroe.arma.nome} (${eroe.arma.tipoDanno})`;
  const pctHero = Math.max(0, (eroe.puntiVita / eroe.maxVita) * 100);
  document.getElementById('hero-hp-bar').style.width = `${pctHero}%`;
  document.getElementById('hero-hp-text').innerText = `${Math.max(0, eroe.puntiVita)}/${eroe.maxVita}`;

  document.getElementById('villain-avatar').innerText = villain.avatar;
  document.getElementById('villain-name').innerText = villain.nome;
  document.getElementById('villain-armor').innerText = `🛡️ Armatura: ${villain.armatura}`;
  const pctVillain = Math.max(0, (villain.puntiVita / villain.maxVita) * 100);
  document.getElementById('villain-hp-bar').style.width = `${pctVillain}%`;
  document.getElementById('villain-hp-text').innerText = `${Math.max(0, villain.puntiVita)}/${villain.maxVita}`;
}

// 4. VALIDAZIONE INPUT E RESET
function inizializzaGioco() {
  eroe = null;
  villain = null;
  turno = 1;
  logDiv.innerHTML = ""; 
  btnRestart.disabled = true;
  victoryScreen.classList.add('hidden'); // Nasconde il banner all'avvio o riavvio

  // Selezione Eroe
  do {
    let scelta = prompt("Scegli la Classe:\n(guerriero, arciere, paladino, mago, ladro, chierico, berserker, necromante)");
    if (scelta) {
      let chiave = scelta.toLowerCase().trim();
      if (personaggiEroe[chiave]) {
        eroe = { ...personaggiEroe[chiave] };
      }
    }
    if (!eroe) { alert("Classe non valida!"); }
  } while (!eroe);

  // Selezione Arma
  do {
    let scelta = prompt("Scegli l'Arma:\n(spada, mazza, arco, bastone magico, pugnali, lanciatore, ascia 2 mani, falce oscura)");
    if (scelta) {
      let chiave = scelta.toLowerCase().trim();
      
      // Mappatura delle stringhe digitate dall'utente alle chiavi del database
      if (chiave === "bastone magico") chiave = "bastone_magico";
      if (chiave === "ascia 2 mani")   chiave = "ascia_bipenne";
      if (chiave === "falce oscura")   chiave = "falce_oscura";

      if (armiEroe[chiave]) {
        eroe.arma = armiEroe[chiave];
      }
    }
    if (!eroe || !eroe.arma) { alert("Arma non valida!"); }
  } while (!eroe || !eroe.arma);

  // Selezione Nemico
  do {
    let scelta = prompt("Scegli il Nemico:\n(orco, cavaliere, drago, goblin, spettro, golem, vampiro)");
    if (scelta) {
      let chiave = scelta.toLowerCase().trim();
      
      if (chiave === "drago reale")     chiave = "drago";
      if (chiave === "goblin scaltro")  chiave = "goblin";
      if (chiave === "spettro urlante") chiave = "spettro";
      if (chiave === "golem di roccia") chiave = "golem";
      if (chiave === "conte vampiro")   chiave = "vampiro";

      if (nemici[chiave]) {
        villain = { ...nemici[chiave] };
      }
    }
    if (!villain) { alert("Nemico non valida!"); }
  } while (!villain);

  aggiornaGrafica();
  aggiungiLog(`⚔️ La leggendaria battaglia ha inizio! ${eroe.avatar} ${eroe.nome} contro ${villain.avatar} ${villain.nome}.`, 'log-system');
  btnAttack.disabled = false;
}
// 5. EVENTI DI COMBATTIMENTO E RIAVVIO

btnAttack.addEventListener('click', () => {
  aggiungiLog(`--- TURNO ${turno} ---`, 'log-system');

  let dannoGrezzo = calcolaDannoBase(eroe.arma.dannoMin, eroe.arma.dannoMax);
  let moltiplicatore = 1;
  let effettoTesto = "";

  if (eroe.arma.tipoDanno === villain.vulnerabilita) {
    moltiplicatore = 2;
    effettoTesto = "💥 <b>Danno Raddoppiato!</b> ";
  } else if (eroe.arma.tipoDanno === villain.resistenza) {
    moltiplicatore = 0.5;
    effettoTesto = "🛡️ <b>Danno Dimezzato!</b> ";
  }

  let dannoFinale = Math.floor(dannoGrezzo * moltiplicatore);
  villain.puntiVita -= dannoFinale;
  aggiungiLog(`${eroe.nome} colpisce con ${eroe.arma.nome}: ${effettoTesto}infligge ${dannoFinale} danni a ${villain.nome}.`, 'log-hero');

  if (villain.puntiVita <= 0) {
    villain.puntiVita = 0;
    aggiornaGrafica();
    aggiungiLog(`🏆 <b>TRIONFO ECLETTICO!</b> ${eroe.nome} ha trucidato ${villain.nome}!`, 'log-system');
    
    // Configura e attiva la visualizzazione del Banner di Vittoria Pop-up
    victoryMessage.innerHTML = `L'eroico <b>${eroe.nome}</b> ha annientato <b>${villain.nome}</b> usando l'arma <i>${eroe.arma.nome}</i> in ${turno} turni!`;
    victoryScreen.classList.remove('hidden');

    btnAttack.disabled = true;
    btnRestart.disabled = false; 
    return;
  }

  eroe.puntiVita -= villain.dannoBase;
  aggiungiLog(`${villain.nome} ruggisce e infligge ${villain.dannoBase} danni a ${eroe.nome}.`, 'log-villain');

  if (eroe.puntiVita <= 0) {
    eroe.puntiVita = 0;
    aggiornaGrafica();
    aggiungiLog(`💀 <b>ESTINZIONE!</b> ${eroe.nome} è perito sotto la furia di ${villain.nome}...`, 'log-system');
    btnAttack.disabled = true;
    btnRestart.disabled = false; 
    return;
  }

  aggiornaGrafica();
  turno++;
});

// Listener per chiudere l'overlay di vittoria e tornare alla schermata di gioco principale
document.getElementById('btn-victory-close').addEventListener('click', () => {
  victoryScreen.classList.add('hidden');
});

btnRestart.addEventListener('click', inizializzaGioco);
window.onload = inizializzaGioco;
