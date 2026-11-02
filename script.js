const board = document.querySelector("#gamespace");
const wiptext = document.querySelector("#wiptext");
let wip="";
let wipids = [];
let lasttileid=-1;
let pointerdn=false;
let moves = 10;
let score = 0;
let tilelets = [];
let won=false;
let gameover=false;

//let utcDate = new Date();
let locDate = new Date();
let locDateInt = locDate.getFullYear() * 372 + locDate.getMonth() * 31 + locDate.getDate();
let roller = RNG(makeSeed(locDateInt));

document.querySelector("#resultspace").classList.remove("shown");
document.querySelector("#infospace").classList.remove("shown");
document.querySelector("#resultspace").classList.add("hidden");
document.querySelector("#infospace").classList.add("hidden");

const letters = [
    'E', 'T', 'A', 'O', 'I', 'N', 'S', 'H',
    'R', 'D', 'L', 'U', 'C', 'W', 'M', 'F',
    'Y', 'G', 'P', 'B', 'V', 'K', 'J', 'X',
    'Q', 'Z'
];

const weights = [
    0.1, 0.09, 0.08, 0.08, 0.07, 0.07, 0.07, 0.06,
    0.06, 0.04, 0.04, 0.03, 0.03, 0.025, 0.025, 0.02,
    0.02, 0.02, 0.02, 0.015, 0.01, 0.01, 0.005, 0.005,
    0.0025, 0.0025
];

for (let i = 0; i < 75; i++) {
    tilelets.push(randomLetter());
}

for (let i = 0; i < 25; i++) {
    const tile = document.createElement("div");
  
    tile.className = "tile";
    tile.dataset.index = i;
    tile.dataset.selected = "false";
    tile.dataset.replacement = 0;
    tile.dataset.letter = tilelets[i];
    tile.textContent = tile.dataset.letter;

    board.appendChild(tile);
}

checkStatus();

board.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return; // Ignore right-click etc.
    if (gameover) return;
    event.preventDefault();
    
    //console.log("pointer down");
    
    const tile = event.target.closest(".tile");
    if (!tile) return;

    if (tile.dataset.replacement == 3) return;

    pointerdn = true;

    const index = Number(tile.dataset.index);
    const row = Math.floor(index / 5);
    const col = index % 5;

    wip = tile.dataset.letter;
    tile.dataset.selected = "true";
    tile.style.backgroundColor = "#787975";
    lasttileid = index;
    wipids.push(index);

    updateWIPText();
});

board.addEventListener("pointermove", (event) => {
    if (!pointerdn) return;
    if (gameover) return;

    //console.log("pointer move");

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const tile = element?.closest(".tile");
    if (!tile) return;

    if (tile.dataset.replacement == 3) return;

    const index = Number(tile.dataset.index);
    const row = Math.floor(index / 5);
    const col = index % 5;

    if (index == wipids[wipids.length - 2]) {
        wip = wip.substring(0, wip.length - 1);
        const tile2 = document.querySelector(`#gamespace .tile[data-index="${wipids[wipids.length - 1]}"]`);
        tile2.dataset.selected = "false";
        tile2.style.backgroundColor = "#f3f4f0";
        //tile2.style.borderColor = getColor(tile2.dataset.replacement);
        lasttileid = wipids[wipids.length - 2];
        wipids.pop();

        updateWIPText();
        return;
    }
    else if (tile.dataset.selected == "true") {
        return;
    }

    let i1 = -1;
    let i2 = -1;
    if (index > lasttileid) {
        i2 = index;
        i1 = lasttileid;
    }
    else {
        i1 = index;
        i2 = lasttileid;
    }
    if (i2 % 5 == 0) {
        if (i2 - i1 != 5 && i2 - i1 != 4) {
            return;
        }
    }
    else if (i1 % 5 == 0) {
        if (i2 - i1 != 6 && i2 - i1 != 5 && i2 - i1 != 1) {
            return;
        }
    }
    else {
        if (i2 - i1 != 6 && i2 - i1 != 5 && i2 - i1 != 4 && i2 - i1 != 1) {
            return;
        }
    }

    wip += tile.dataset.letter;
    tile.dataset.selected = "true";
    tile.style.backgroundColor = "#787975";
    lasttileid = index;
    wipids.push(index);

    updateWIPText();
});

document.querySelector("#infobutton").addEventListener("click", () => {
    document.querySelector("#infospace").classList.remove("hidden");
    document.querySelector("#infospace").classList.add("shown");
});

document.querySelector("#hideinfo").addEventListener("click", () => {
    document.querySelector("#infospace").classList.remove("shown");
    document.querySelector("#infospace").classList.add("hidden");
});

document.querySelector("#hideresult").addEventListener("click", () => {
    document.querySelector("#resultspace").classList.remove("shown");
    document.querySelector("#resultspace").classList.add("hidden");
});

function stopDragging() {
    //console.log("stopping drag");
    
    pointerdn = false;
    const tiles = document.querySelectorAll("#gamespace .tile");

    let valid = checkWord(wip);

    let greensClear = true;
    tiles.forEach((tile) => {
        if (valid && tile.dataset.selected =="true") {
            let tdr = (Number)(tile.dataset.replacement);
            if (tdr == 0) {
                score += 3;
            } else if (tdr == 1) {
                score += 2;
            } else if (tdr == 2) {
                score += 1;
            }

            tile.dataset.replacement = tdr + 1;
            if (tile.dataset.replacement == 3) {
                tile.dataset.letter = " ";
                tile.textContent = tile.dataset.letter;
            } else {
                let id = (Number)(tile.dataset.index);
                tile.dataset.letter = tilelets[(tdr + 1) * 25 + id];
                tile.textContent = tile.dataset.letter;
            }           
        }
        if (tile.dataset.replacement == "0") {
            greensClear = false;
        }

        tile.dataset.selected = "false";
        tile.style.backgroundColor = "#f3f4f0";
        tile.style.borderColor = getColor(tile.dataset.replacement);
    });

    lasttileid = -1;
    wip = "";
    updateWIPText();
    updateScoreText();

    saveStatus();

    if (valid) {
        moves -= 1;
        updateMovesText()
    }
    if (greensClear) {
        score += moves * 10;
        won = true;
        showResults();
    } else if (moves == 0) {
        showResults();
    }
}

window.addEventListener("pointerup", stopDragging);
//window.addEventListener("pointercancel", stopDragging);

const jsonresp = await fetch("./wordtrie.json");
const jsondata = await jsonresp.json();

// Will return a boolean
function checkWord(word) {
    let node = jsondata;
    for (const char of word.toLowerCase()) {
        node = node.children?.[char];

        if (!node) return false;
    }

    return node.isWord;
}

function showResults() {
    let rs = document.querySelector("#resultspace");
    let rsh1 = rs.querySelector("h1");
    let rsdiv = rs.querySelector("div");

    if (won) {
        rsh1.textContent = "CONGRATULATIONS";
    } else {
        rsh1.textContent = "BETTER LUCK NEXT TIME";
    }
    rsdiv.textContent = "score: " + score + "\n\n" + moves + " moves left"
    
    document.querySelector("#resultspace").classList.remove("hidden");

    showResultsButton();
    saveStatus();
}

function getColor(replac) {
    if (replac == 0) {
        return "#426f0f";
    }
    else if (replac == 1) {
        return "#d4c32b";
    }
    else if (replac == 2) {
        return "#ad311b";
    }
    else {
        return "#f3f4f0";
    }
}

function randomLetter() {
    let roll = roller();
    
    //let roll = Math.random();

    let idx = 0;
    for (const weight of weights) {
        roll -= weight;
        if (roll < 0) return letters[idx];
        else idx += 1;
    }
    return 'E';
}

function fitText(element, maxSize=24, minSize=8) {
    let size = Math.min(Math.floor(parseFloat(maxSize)), 28);
    element.style.fontSize = size + "px";

    while (
        element.scrollWidth > element.clientWidth &&
        size > minSize
    ) {
        size--;
        element.style.fontSize = size + "px";
    }
}

function updateWIPText() {
    let printwip = wip.substring(0,1);
    for (let i = 1; i < wip.length; i++) {
        printwip += " " + wip.substring(i,i+1);
    }
    const wiph1 = wiptext.querySelector("h1");
    wiph1.textContent = printwip;
    fitText(wiph1, getComputedStyle(document.querySelector(".tile")).fontSize, 8);
}

function updateMovesText() {
    const movesh1 = document.querySelector("#movesdisplay").querySelector("h1");
    if (moves == 1) {
        movesh1.textContent = "1 move";
    } else {
        movesh1.textContent = moves + " moves";
    }
}

function updateScoreText() {
    const scoreh1 = document.querySelector("#scoredisplay").querySelector("h1");
    scoreh1.textContent = "score " + score;
}

const observer = new ResizeObserver(() => {
    updateWIPText();
});

observer.observe(wiptext);

function RNG(seed) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function makeSeed(date) {
    let seed = date * 374761393;
    //seed = (seed + index * 668265263) | 0;
    //seed = (seed + replac * 2246822519) | 0;
    return seed;
}

function saveStatus() {
    console.log("saving...");
    
    const tiles = document.querySelectorAll("#gamespace .tile");
    let replacs = [];
    tiles.forEach((tile) => {
        let id = (Number)(tile.dataset.index);
        let rep = (Number)(tile.dataset.replacement);
        replacs[id] = rep;
    });
    
    const status = {
        date: locDateInt,
        score: score,
        moves: moves,
        over: gameover,
        won: won,
        reps: replacs
    };

    localStorage.setItem("dailyPuzzle", JSON.stringify(status));
    console.log("saved");
}

function checkStatus() {
    console.log("checking saved");
    const savedStatus = JSON.parse(localStorage.getItem("dailyPuzzle"));

    if (savedStatus && savedStatus.date == locDateInt) {
        // set all tiles as appropriate
        const tiles = document.querySelectorAll("#gamespace .tile");
        tiles.forEach((tile) => {
            let id = (Number)(tile.dataset.index);
            tile.dataset.replacement = savedStatus.reps[id];
            tile.style.borderColor = getColor(tile.dataset.replacement);

            if (savedStatus.reps[id] < 3) 
                tile.dataset.letter = tilelets[savedStatus.reps[id] * 25 + id];
            else
                tile.dataset.letter = " ";
            tile.textContent = tile.dataset.letter;
        });

        gameover = savedStatus.over;
        won = savedStatus.won;
        score = savedStatus.score;
        moves = savedStatus.moves;
        updateMovesText();
        updateScoreText();
        console.log("status fixed");
    }

    if (gameover) {
        showResultsButton();
    }
}

function showResultsButton() {
    document.querySelector("#scorespace").innerHTML = `<button id="showresult" style="border-color:black; border-width:1px; border-style:solid">show results</button>`;
    document.querySelector("#showresult").addEventListener("click", () => {
        document.querySelector("#resultspace").classList.remove("hidden");
        document.querySelector("#resultspace").classList.add("shown");
    });
}