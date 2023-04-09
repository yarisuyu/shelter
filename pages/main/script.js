import { addElement, renderPetList } from "../../assets/scripts/script.js"

let width = screen.width;

if (width > 768) {
    renderPetList(0, 3);
}
else if (width > 320) {
    renderPetList(0, 2);
}
else {
    renderPetList(0, 1);

    let burger = document.querySelector('.header__burger-btn');
    burger.addEventListener('click', () => {
        document.querySelector('.header').classList.toggle('open');
    });
}