const board = document.querySelector("#gamespace");
const wiptext = document.querySelector("#wiptext");
let wip="";
let wipids = [];
let lasttileid=-1;
let pointerdn=false;

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

for (let i = 0; i < 25; i++) {
    const tile = document.createElement("div");
  
    tile.className = "tile";
    tile.dataset.index = i;
    tile.dataset.selected = "false";
    tile.dataset.replacement = 0;
    tile.dataset.letter = randomLetter();
    tile.textContent = tile.dataset.letter;

    board.appendChild(tile);
}

board.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return; // Ignore right-click etc.
    event.preventDefault();
    
    const tile = event.target.closest(".tile");
    if (!tile) return;

    pointerdn = true;

    const index = Number(tile.dataset.index);
    const row = Math.floor(index / 5);
    const col = index % 5;

    wip = tile.dataset.letter;
    tile.dataset.selected = "true";
    tile.style.backgroundColor = "#676a51";
    lasttileid = index;
    wipids.push(index);

    //console.log(`Tile ${index}, row ${row}, column ${col}`);
    //console.log(`WIP: ${wip}`);

    updateWIPText();
});

board.addEventListener("pointermove", (event) => {
    if (!pointerdn) return;

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const tile = element?.closest(".tile");
    if (!tile) return;

    const index = Number(tile.dataset.index);
    const row = Math.floor(index / 5);
    const col = index % 5;

    if (index == wipids[wipids.length - 2]) {
        wip = wip.substring(0, wip.length - 1);
        const tile2 = document.querySelector(`#gamespace .tile[data-index="${wipids[wipids.length - 1]}"]`);
        tile2.dataset.selected = "false";
        tile2.style.backgroundColor = getColor(tile2.dataset.replacement);
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
    tile.style.backgroundColor = "#676a51";
    lasttileid = index;
    wipids.push(index);

    updateWIPText();
});

function stopDragging() {
    pointerdn = false;
    const tiles = document.querySelectorAll("#gamespace .tile");

    let valid = checkWord(wip);
    console.log(valid);

    tiles.forEach((tile) => {
        if (valid && tile.dataset.selected =="true") {
            tile.dataset.letter =  randomLetter();
            tile.textContent = tile.dataset.letter;
            tile.dataset.replacement = (Number)(tile.dataset.replacement) + 1;
        }
        tile.dataset.selected = "false";
        tile.style.backgroundColor = getColor(tile.dataset.replacement);
    });

    lasttileid = -1;
    wip = "";
    updateWIPText();
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

function getColor(replac) {
    if (replac == 0) {
        return "#5e9ede";
    }
    else if (replac == 1) {
        return "#6ed8b6";
    }
    else if (replac == 2) {
        return "#bae075";
    }
    else if (replac == 3) {
        return "#c8905b";
    }
    else if (replac == 4) {
        return "#c96161";
    }
    else {
        return "#7c7c7c";
    }
}

function randomLetter() {
    let roll = Math.random();

    let idx = 0;
    for (const weight of weights) {
        roll -= weight;
        if (roll < 0) return letters[idx];
        else idx += 1;
    }
    return 'E';
}

function fitText(element, maxSize=24, minSize=8) {
    console.log(maxSize);
    let size = Math.floor(parseFloat(maxSize));
    console.log(size);
    element.style.fontSize = size + "pt";

    while (
        element.scrollWidth > element.clientWidth &&
        size > minSize
    ) {
        size--;
        element.style.fontSize = size + "pt";
        console.log("size decrease");
    }
    console.log(size);
}

function updateWIPText() {
    console.log("start update");
    let printwip = wip.substring(0,1);
    for (let i = 1; i < wip.length; i++) {
        printwip += " " + wip.substring(i,i+1);
    }
    const wiph1 = wiptext.querySelector("h1");
    wiph1.textContent = printwip;
    fitText(wiph1, getComputedStyle(wiph1).fontSize, 8);
    console.log("update complete");
}

const observer = new ResizeObserver(() => {
    updateWIPText();
});

observer.observe(wiptext);