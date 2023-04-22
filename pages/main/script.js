import {
    showRandomPets,
    showPreviousPets,
    showNextPets
} from "../../assets/scripts/script.js"



let width = screen.width;

if (width >= 1280) {
    sessionStorage.setItem('pageSize', '3');
}
else if (width >= 768) {
    sessionStorage.setItem('pageSize', '2');
}
else {
    sessionStorage.setItem('pageSize', '1');

    let burger = document.querySelector('.header__burger-btn');
    burger.addEventListener('click', () => {
        document.querySelector('.header').classList.toggle('open');
    });
}


sessionStorage.setItem('currentPage', '1');
showRandomPets();

window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('pageSize');
    sessionStorage.removeItem('randomizedPetList');
 });

/* slider event listeners */

const previousBtn = document.getElementById('pets-previous');
previousBtn.addEventListener('click', showPreviousPets);


const nextBtn = document.getElementById('pets-next');
nextBtn.addEventListener('click', showNextPets);
