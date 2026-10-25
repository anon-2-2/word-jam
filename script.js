/*document.querySelector("#clickme").addEventListener("click", () => {
    document.querySelector("#textspot").textContent =
      "About time.";
  });*/

const board = document.querySelector("#gamespace");
const wipspace = document.querySelector("#wipspace");
const wiptext = document.querySelector("#wiptext");
let wip="";
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
        
            wip += tile.dataset.letter;
            tile.dataset.selected = true;
        
            console.log(`Tile ${index}, row ${row}, column ${col}`);
            console.log(`WIP: ${wip}`);

            let printwip = wip.substring(0,1);
            for (let i = 1; i < wip.length; i++) {
                printwip += " " + wip.substring(i,i+1);
            }
            document.querySelector("#wiptext").textContent = printwip;
            fitText(wipspace, wiptext, 10, wiptext.style.fontSize);
        }
        else {
            console.log(`Selection failed`);
        }
    });

    board.appendChild(tile);
}

board.addEventListener("pointerdown", (event) => {
    const tile = event.target.closest(".tile");
    if (!tile) return;

    pointerdn = true;

    const index = Number(tile.dataset.index);
    const row = Math.floor(index / 7);
    const col = index % 7;

    wip = tile.dataset.letter;
    tile.dataset.selected = "true";

    console.log(`Tile ${index}, row ${row}, column ${col}`);
    console.log(`WIP: ${wip}`);
});

function fitText(element1, element2, minSize = 14, maxSize = 28) {
    element2.style.fontSize = `${maxSize}px`;

    while (
        element2.scrollWidth > element1.width &&
        parseFloat(element2.style.fontSize) > minSize
    ) {
        element2.style.fontSize =
            `${parseFloat(element2.style.fontSize) - 1}px`;
    }
}