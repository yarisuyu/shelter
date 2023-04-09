import { renderPetList } from "../../assets/scripts/script.js"

let width = screen.width;

if (width > 768) {
    renderPetList(0, 8);
}
else if (width > 320) {
    renderPetList(0, 6);
}
else {
    renderPetList(0, 3);
}