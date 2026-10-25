const board = document.querySelector("#gamespace");
const wiptext = document.querySelector("#wiptext");
let wip="";
let wipids = [];
let lasttileid=-1;
let pointerdn=false;

for (let i = 0; i < 49; i++) {
    const tile = document.createElement("div");
  
    tile.className = "tile";
    tile.dataset.index = i;
    tile.dataset.selected = "false";
    tile.dataset.letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[
        Math.floor(Math.random() * 26)
    ];
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
    const row = Math.floor(index / 7);
    const col = index % 7;

    wip = tile.dataset.letter;
    tile.dataset.selected = "true";
    tile.style.backgroundColor = "#676a51";
    lasttileid = index;
    wipids.push(index);

    //console.log(`Tile ${index}, row ${row}, column ${col}`);
    //console.log(`WIP: ${wip}`);

    let printwip = wip.substring(0,1);
    for (let i = 1; i < wip.length; i++) {
        printwip += " " + wip.substring(i,i+1);
    }
    wiptext.textContent = printwip;
});

board.addEventListener("pointermove", (event) => {
    if (!pointerdn) return;

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const tile = element?.closest(".tile");
    if (!tile) return;

    const index = Number(tile.dataset.index);
    const row = Math.floor(index / 7);
    const col = index % 7;

    if (index == wipids[wipids.length - 2]) {
        wip = wip.substring(0, wip.length - 1);
        const tile2 = document.querySelector(`#gamespace .tile[data-index="${wipids[wipids.length - 1]}"]`);
        tile2.dataset.selected = "false";
        tile2.style.backgroundColor = "#e5e2ce";
        lasttileid = wipids[wipids.length - 2];
        wipids.pop();

        let printwip = wip.substring(0,1);
        for (let i = 1; i < wip.length; i++) {
            printwip += " " + wip.substring(i,i+1);
        }
        wiptext.textContent = printwip;
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
    if (i2 % 7 == 0) {
        if (i2 - i1 != 7 && i2 - i1 != 6) {
            return;
        }
    }
    else if (i1 % 7 == 0) {
        if (i2 - i1 != 8 && i2 - i1 != 7 && i2 - i1 != 1) {
            return;
        }
    }
    else {
        if (i2 - i1 != 8 && i2 - i1 != 7 && i2 - i1 != 6 && i2 - i1 != 1) {
            return;
        }
    }

    wip += tile.dataset.letter;
    tile.dataset.selected = "true";
    tile.style.backgroundColor = "#676a51";
    lasttileid = index;
    wipids.push(index);

    let printwip = wip.substring(0,1);
    for (let i = 1; i < wip.length; i++) {
        printwip += " " + wip.substring(i,i+1);
    }
    wiptext.textContent = printwip;
});

function stopDragging() {
    pointerdn = false;
    const tiles = document.querySelectorAll("#gamespace .tile");

    let valid = checkWord(wip);
    console.log(valid);

    tiles.forEach((tile) => {
        if (valid && tile.dataset.selected =="true") {
            tile.dataset.letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[
                Math.floor(Math.random() * 26)
            ];
            tile.textContent = tile.dataset.letter;
        }
        tile.dataset.selected = "false";
        tile.style.backgroundColor = "#e5e2ce";
    });

    lasttileid = -1;
    wip = "";
    wiptext.textContent = "";
}

window.addEventListener("pointerup", stopDragging);
window.addEventListener("pointercancel", stopDragging);

/* */

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

