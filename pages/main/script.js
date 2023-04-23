import {
    showRandomPets,
    showPreviousPets,
    showNextPets,
    toggleNavMenu
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

    document.querySelector('.header__burger-btn')
        .addEventListener('click', toggleNavMenu);


    document.getElementById("nav-menu")
        .addEventListener('click', e => {
            if (e.target.tagName.toLowerCase() === 'a') {
                toggleNavMenu();
            }
        });

    document.getElementById("overlay")
        .addEventListener('click', () => {
            if (document.querySelector("header").classList.contains("open")) {
                toggleNavMenu();
            }
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
