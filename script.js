/*document.querySelector("#clickme").addEventListener("click", () => {
    document.querySelector("#textspot").textContent =
      "About time.";
  });*/

const board = document.querySelector("#gamespace");
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

