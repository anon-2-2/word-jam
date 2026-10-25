/*document.querySelector("#clickme").addEventListener("click", () => {
    document.querySelector("#textspot").textContent =
      "About time.";
  });*/

const board = document.querySelector("#gamespace");
const wiptext = document.querySelector("#wiptext");
let wip="";
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

    tile.addEventListener("pointerenter", (event) => {
        if (pointerdn && tile.dataset.selected=="false") {
            const index = Number(tile.dataset.index);
            const row = Math.floor(index / 7);
            const col = index % 7;

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
            tile.dataset.selected = true;
            lasttileid = index;
        
            console.log(`Tile ${index}, row ${row}, column ${col}`);
            console.log(`WIP: ${wip}`);

            let printwip = wip.substring(0,1);
            for (let i = 1; i < wip.length; i++) {
                printwip += " " + wip.substring(i,i+1);
            }
            wiptext.textContent = printwip;
        }
        else {
            console.log(`Selection failed`);
        }
    });

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
    lasttileid = index;

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
    tile.dataset.selected = true;
    lasttileid = index;

    let printwip = wip.substring(0,1);
    for (let i = 1; i < wip.length; i++) {
        printwip += " " + wip.substring(i,i+1);
    }
    wiptext.textContent = printwip;
});